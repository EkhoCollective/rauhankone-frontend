<script lang="ts">
	// Imports
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base, resolve } from '$app/paths';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import DOMPurify from 'dompurify';
	import Textarea from '$lib/components/mini-components/Textarea.svelte';
	import Loader from '$lib/components/mini-components/Loader.svelte';
	import { blur, fade, scale, slide } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { useAudio } from '$lib/composables/useAudio';
	import { customErrorHandler } from '$lib/utils/customErrrorHandler';
	import Footer from '$lib/components/mini-components/Footer.svelte';
	import TopLeftBackBtn from '$lib/components/mini-components/TopLeftBackBtn.svelte';
	import ConfirmCheckIcon from '$lib/components/mini-components/ConfirmCheckIcon.svelte';
	import BackgroundMouse from '$lib/components/mini-components/BackgroundMouse.svelte';
	// Get navigation context from layout
	const navigationContext = getContext('navigation') as {
		setSource: (source: 'main' | 'submit') => void;
		setSubmittedStoryId: (storyId: string) => void;
		getNavigationData: () => { source: 'main' | 'submit' | null; storyId: string | null };
		clearNavigation: () => void;
	};

	const { playBlip, switchToPage, playtoMap } = useAudio();

	// Get Questions Data from Parent Layout
	// const getQuestionsData = getContext('questions') as () => any;

	// States
	let getQuestionsData = $state<any>(null);
	let question = $state<string | null>(null);
	let questionOriginalId = $state<string | null>(null);
	let questionContainer = $state<any[] | null>(null);
	let story = $state('');
	let suggestion = $state('');
	let userAgreed = $state(false);
	let isTyping = $state(false);
	let typingTimer = $state(750);
	let storyComplete = $state(false);
	let minStoryLength = $state(30);
	let suggestionState = $state('off');
	let suggestionFadeTimer = $state(3000);
	let thankYouFadeTimer = $state(3000);
	let transitionDuration: number = 500;

	let localeNow = getLocaleFullName();
	console.log('Current locale inside submit:', localeNow);
	// let raiseError = $state(false);

	// API Options
	const API_QUESTIONS_OPTIONS = () => ({
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { question_type: 'starter' }
	});

	const API_SUGGESTION_OPTIONS = () => ({
		API_ENDPOINT: '/suggestion',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: getLocaleFullName(), story: story }
	});

	const API_ADD_STORY_OPTIONS = () => ({
		API_ENDPOINT: '/add_story',
		API_METHOD: 'POST',
		REQUEST_BODY: {
			text: DOMPurify.sanitize(story),
			question: questionOriginalId,
			language: getLocaleFullName()
		}
	});

	let backgroundRef: BackgroundMouse | undefined = $state();

	function handleMouseMove(e: MouseEvent) {
		if (backgroundRef) {
			backgroundRef.updateCoords(e);
		}
	}

	// Functions
	async function handleSubmit() {
		if (userAgreed === true) {
			await apiRequest(API_ADD_STORY_OPTIONS())
				.then((response) => {
					// console.log('Add Story Response:', response);

					// Set navigation context before going to explore
					navigationContext.setSource('submit');

					// Check multiple possible field names for the story ID
					let storyId = response.story_id || response.id || response.storyId || response.story?.id;
					// console.log('Extracted story ID:', storyId);

					if (storyId) {
						navigationContext.setSubmittedStoryId(storyId);
					} else {
						// console.warn('No story ID found in response:', response);
					}

					goto(resolve('/explore'));
				})
				.catch((err) => {
					customErrorHandler($_('error_description_general'), 500);
				});
		}
	}

	async function handleGetSuggestions() {
		try {
			const response = await apiRequest(API_SUGGESTION_OPTIONS());
			suggestion = response.suggestion;
			suggestionState = 'ok';
		} catch (err) {
			// console.error('Failed to get suggestions:', err);
			customErrorHandler($_('error_description_general'), 500);
		}
	}

	async function handleGetQuestions() {
		await apiRequest(API_QUESTIONS_OPTIONS())
			.then((response) => {
				getQuestionsData = response;
				handleGetQuestionContainer();
			})
			.catch((err) => {
				// console.log('Error getting questions', error);
				// raiseError = true;
				customErrorHandler($_('error_description_general'), 500);
			});
	}

	function handleGetQuestionContainer() {
		// const questionsData = getQuestionsData();
		if (!getQuestionsData) {
			customErrorHandler($_('error_description_general'), 500);
		}
		const randomGroupIndex = Math.floor(Math.random() * getQuestionsData.questions.length);
		questionContainer = getQuestionsData.questions[randomGroupIndex];
		handleGetQuestion();
	}

	function handleGetQuestion() {
		if (!questionContainer) {
			console.error('Question container is null');
			return;
		}
		let filteredQuestion = questionContainer.find((q: any) => q.language === localeNow);

		// If North Sami not found, fallback to English
		if (!filteredQuestion && localeNow === 'North Sámi') {
			filteredQuestion = questionContainer.find((q: any) => q.language === 'English');
		}

		if (!filteredQuestion) {
			console.error('No suitable question found');
			customErrorHandler($_('error_description_general'), 500);
		}
		question = filteredQuestion.text;
		questionOriginalId = filteredQuestion.original_id;
	}

	// Function to handle typing detection
	function handleTyping() {
		// Check if story is empty - always set to "off" regardless of typing state or current state
		if (story.length <= 0) {
			suggestionState = 'off';
			storyComplete = false;
			return;
		}
		// If story is already complete (done state), check that first that
		// the user didn't delete the story content
		if (suggestionState === 'done') {
			if (story.length < minStoryLength) {
				suggestionState = 'warning';
				storyComplete = false;
			}

			return;
		}
		// When user is actively typing
		if (isTyping === true) {
			// If user was in 'ok' state (had received suggestion) and starts typing again,
			// set to 'off' first, then will transition to 'done' when they stop typing
			if (suggestionState === 'ok') {
				suggestionState = 'off';
				storyComplete = true;
			} else {
				// Reset to off state while typing for other states
				suggestionState = 'off';
			}
		} else {
			// When user has stopped typing
			if (story.length < minStoryLength) {
				suggestionState = 'warning';
			} else if (
				story.length >= minStoryLength &&
				suggestionState !== 'ok' &&
				suggestionState !== 'done' &&
				suggestionState !== 'loading' &&
				storyComplete === false
			) {
				// Only set to loading if we haven't already received a suggestion or completed the story
				suggestionState = 'loading';
				// Trigger API call to get suggestions
				handleGetSuggestions();
			} else if (
				suggestionState === 'off' &&
				story.length >= minStoryLength &&
				storyComplete === true
			) {
				// If user was in 'ok' state, started typing (set to 'off'), and now stopped typing
				// with sufficient story length, set to 'done'
				suggestionState = 'done';
			}
		}
	}

	function playToMapSound() {
		playtoMap();
	}
	// Watch for changes in the story text and locale
	$effect(() => {
		$locale; // subscribe to locale changes
		// update current locale and refresh question if we already have questions
		localeNow = getLocaleFullName();
		if (getQuestionsData) {
			handleGetQuestion();
		}
		// run typing logic whenever story or locale changes (story is bound in Textarea)
		handleTyping();
	});

	// Watch for locale changes and update question
	$effect(() => {
		$locale;
		// console.log('locale changed', localStorage.getItem('locale'));
		if (getQuestionsData) {
			handleGetQuestion();
		}
	});

	// On Mount
	onMount(() => {
		switchToPage('submit');
		handleGetQuestions();
		// handleGetQuestionContainer();
		// raiseError = true;
	});
</script>

<svelte:head>
	<title>{$_('main_title')} | {$_('main_subtitle')} | Oulu 2026</title>
</svelte:head>

<header>
	<TopLeftBackBtn button_text_id="back" rel_url="/" />
</header>

<div class="card-submit-container" onmousemove={handleMouseMove} role="presentation">
	<div class="card-bg-container">
		<BackgroundMouse
			bind:this={backgroundRef}
			maxMovement={75}
			stiffness={0.05}
			damping={0.95}
			bgImage="/submit_bg.png"
		/>
	</div>
	<div class="card-left-col-container">
		<!-- Main Text -->
		{#if question}
			<div
				in:fade={{ duration: transitionDuration }}
				out:fade={{ duration: transitionDuration }}
				class="question-container"
			>
				<span id="question-label-main">{question}</span>
			</div>

		<div class="input-container" 
		out:slide={{ duration: transitionDuration }}
		>
			<Textarea
				name={$_('submit_input_placeholder', { default: 'Your story' })}
				bind:textValue={story}
				debounceTime={typingTimer}
				labelId="question-label-main"
				bind:typingActive={isTyping}
			/>
		</div>
		<!-- Suggestions -->
		<div class="suggestions-container">
			{#if suggestionState !== 'off'}
				<div 
				in:slide={{ duration: transitionDuration }}
				out:slide={{ duration: transitionDuration }}
				></div>
			{/if}
			<!-- Show warning if story is too short -->
			{#if suggestionState === 'warning'}
				<div class="warning-bubble bubble" 
				in:slide={{ duration: transitionDuration }} 
				out:slide={{ duration: transitionDuration }}
				>
					<p>
						{#if story.length === 0}
							{$_('submit_type_story')}
						{:else}
							{$_('submit_type_more')}
						{/if}
					</p>
				</div>
			{/if}
			<!-- Show loader when waiting for suggestions -->
			{#if suggestionState === 'loading'}
				<div class="loader-bubble bubble" 
				in:slide={{ duration: transitionDuration }} 
				out:slide={{ duration: transitionDuration }}
				>
					<Loader color="white" pulseSize="30px" pulseTiming="1s" />
				</div>
			{/if}
			<!-- Show suggestion if user has typed something -->
			{#if suggestionState === 'ok'}
				<div
					in:slide={{ duration: transitionDuration }}
					out:slide={{ duration: transitionDuration }}
					class="suggestions-bubble bubble"
				>
					<p>{$_('submit_please_extend')}</p>
					<br />
					<p>{suggestion}</p>
				</div>
			{/if}
			<!-- Show thank you message if user has finished the story -->
			{#if suggestionState === 'done'}
				<p
					in:slide={{ duration: transitionDuration }}
					out:blur={{ duration: thankYouFadeTimer }}
					class="thank-you-bubble bubble"
				>
					{$_('submit_acknowlegment')}
				</p>
			{/if}
		</div>
		<!-- Input Area -->
	{/if}
	</div>
	<!-- Actions -->

	<div class="actions-container">
		{#if (suggestionState === 'done' || suggestionState === 'ok' || storyComplete === true) && story.length > minStoryLength}
			<!-- Disclaimer -->
			<div transition:blur class="disclaimer-container">
				<!-- Checkmark -->
				<ConfirmCheckIcon
					{handleSubmit}
					bind:checkValue={userAgreed}
					translateIdForCheckbox={'submit_disclaimer'}
					hideLabel={false}
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.card-bg-container {
		display: none;
	}
	.card-left-col-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 0;
		max-width: 70%;
		width: 100%;
	}

	/* .footer-container {
		padding: 10%;
	} */

	.card-submit-container {
		min-height: 100vh;
		min-width: 100vw;
		max-width: 100%;
		padding: 5% 10% 5% 10%;
		height: 100%;
		display: flex;
		flex-direction: row;
	}
	.question-container {
		display: flex;
		grid-area: question;
		margin-top: var(--pad-5);
		font-size: var(--f16);
		max-width: 100%;
		margin-bottom: var(--pad-5);
		/* border-bottom: 1px solid white; */
	}

	.question-container > * {
		line-height: 1.5;
	}

	.input-container {
		grid-area: input-container;
		display: flex;
		flex-direction: column;
		min-width: 100%;
		font-size: var(--f18);
		font-family: 'Roboto Slab', serif;
	}

	.suggestions-container {
		grid-area: suggestions-area;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: var(--pad-2);
		position: relative;
	}
	.disclaimer-container {
		font-size: var(--f14);
		line-height: 1.25;
	}

	/* .disclaimer-btn-container {
		margin: var(--pad-1);
		align-self: end;
	} */

	.actions-container {
		grid-area: actions-area;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100px;
		max-width: 40%;
		min-width: 40%;
		margin: 0 0 auto 0;
		padding-top: calc(var(--pad-5) + 2px);
		margin-left: 40px;
	}

	.bubble {
		max-width: 100%;
		min-width: 90%;
		text-align: left;
		border-radius: var(--pad-1);
		margin-top: var(--pad-1);
		margin-bottom: var(--pad-2);
		padding: var(--pad-1);
	}

	.bubble > p {
		max-width: 70ch;
		font-size: var(--f14);
		margin: 0;
	}

	.warning-bubble {
		color: #ffbcbc;
		background-color: #ffbcbc1a;
	}

	.loader-bubble {
		position: absolute;
		top: var(--pad-1);
		left: var(--pad-1);
		background-color: transparent;
	}

	.suggestions-bubble {
		position: relative;
		color: #ffe7c3;
		background-color: #ffe7c31a;
	}

	.thank-you-bubble {
		color: #cfffcf;
		background-color: #cfffcf1a;
	}

	/* Media Queries */
	@media (max-width: 768px) {
		.card-submit-container {
			display: grid;
			grid-template-areas:
				'left-col'
				'actions-area';
			grid-template-columns: 1fr;
			grid-template-rows: max-content max-content;
		}

		.card-left-col-container {
			max-width: 100%;
			width: 100%;
			grid-area: left-col;
			margin: 0;
			padding: 0;
		}

		.question-container {
			max-width: 95%;
			margin-bottom: var(--pad-2);
		}

		.suggestions-container {
			max-width: 100%;
			margin-right: auto;
			margin-top: var(--pad-1);
		}

		.input-container {
			margin-bottom: 0;
		}

		.actions-container {
			grid-area: actions-area;
			max-width: 100%;
			min-width: 100%;
			margin: var(--pad-4) 0 0 0;
			padding: 0;
			flex-direction: row;
			justify-content: center;
			gap: var(--pad-3);
		}

		.bubble {
			/* max-width: 90%;
			margin-left: auto; */
		}

		.disclaimer-container {
			/* display: flex;
			min-width: 100%;
			margin-top: 0; */
		}

		@keyframes stretchIn {
			0% {
				transform: scaleY(0);
			}
			100% {
				transform: scaleY(1);
			}
		}
	}
</style>
