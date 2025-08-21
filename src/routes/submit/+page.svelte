<script lang="ts">
	// Imports
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import DOMPurify from 'dompurify';
	import Checkmark from '$lib/components/mini-components/CheckIcon.svelte';
	import Textarea from '$lib/components/mini-components/Textarea.svelte';
	import Loader from '$lib/components/mini-components/Loader.svelte';
	import { error } from '@sveltejs/kit';
	// import CardError from '$lib/components/cards/CardError.svelte';
	import { blur, fade } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { useAudio } from '$lib/composables/useAudio';

	// Get navigation context from layout
	const navigationContext = getContext('navigation') as {
		setSource: (source: 'main' | 'submit') => void;
		setSubmittedStoryId: (storyId: string) => void;
		getNavigationData: () => { source: 'main' | 'submit' | null; storyId: string | null };
		clearNavigation: () => void;
	};

	const { playBlip, switchToPage } = useAudio();

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

	// Functions
	async function handleSubmit() {
		if (userAgreed === true) {
			await apiRequest(API_ADD_STORY_OPTIONS())
				.then((response) => {
					console.log('Add Story Response:', response);

					// Set navigation context before going to explore
					navigationContext.setSource('submit');

					// Check multiple possible field names for the story ID
					let storyId = response.story_id || response.id || response.storyId || response.story?.id;
					console.log('Extracted story ID:', storyId);

					if (storyId) {
						navigationContext.setSubmittedStoryId(storyId);
					} else {
						console.warn('No story ID found in response:', response);
					}

					goto(`${base}/explore`);
				})
				.catch((err) => {
					throw error(500, 'Failed to add story');
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
			throw error(500, 'Failed to get suggestions');
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
				throw error(500, 'Failed to get questions');
			});
	}

	function handleGetQuestionContainer() {
		// const questionsData = getQuestionsData();
		if (!getQuestionsData) {
			throw error(500, 'Failed to get questions');
			return;
		}
		const randomGroupIndex = Math.floor(Math.random() * getQuestionsData.questions.length);
		questionContainer = getQuestionsData.questions[randomGroupIndex];
		handleGetQuestion();
	}

	function handleGetQuestion() {
		if (!questionContainer) {
			return;
		}
		let filteredQuestion = questionContainer.find((q: any) => q.language === getLocaleFullName());

		// If North Sami not found, fallback to English
		if (!filteredQuestion && getLocaleFullName() === 'North Sámi') {
			filteredQuestion = questionContainer.find((q: any) => q.language === 'English');
		}

		if (!filteredQuestion) {
			throw error(500, 'Failed to get question container');
			return;
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
		// If story is already complete (done state), don't change anything
		if (suggestionState === 'done') {
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

	function playUISound() {
		playBlip();
	}

	// Watch for changes in the story text
	$effect(() => {
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

<div class="card-submit-container">
	<!-- Main Text -->
	{#if question}
		<div
			in:fade={{ duration: transitionDuration }}
			out:fade={{ duration: transitionDuration }}
			class="question-container"
		>
			<p>{question}</p>
		</div>

		<!-- Input Area -->
		<div class="input-container">
			<Textarea
				bind:textValue={story}
				minHeight="200px"
				debounceTime={typingTimer}
				bind:typingActive={isTyping}
			/>
		</div>
	{/if}
	<!-- Suggestions -->
	<div class="suggestions-container">
		{#if suggestionState !== 'off'}
			<div></div>
		{/if}
		<!-- Show warning if story is too short -->
		{#if suggestionState === 'warning'}
			<div transition:blur class="warning-bubble bubble">
				{$_('submit_type_more')}
			</div>
		{/if}
		<!-- Show loader when waiting for suggestions -->
		{#if suggestionState === 'loading'}
			<div transition:blur class="loader-bubble bubble">
				<Loader color="white" pulseSize="30px" pulseTiming="1s" />
			</div>
		{/if}
		<!-- Show suggestion if user has typed something -->
		{#if suggestionState === 'ok'}
			<div
				in:blur
				out:blur={{ delay: suggestionFadeTimer, duration: 500 }}
				class="suggestions-bubble bubble"
			>
				<p>{suggestion}</p>
				<p>{$_('submit_please_extend')}</p>
			</div>
		{/if}
		<!-- Show thank you message if user has finished the story -->
		{#if suggestionState === 'done'}
			<p
				in:blur={{ delay: thankYouFadeTimer, duration: 500 }}
				out:blur
				class="thank-you-bubble bubble"
			>
				{$_('submit_acknowlegment')}
			</p>
		{/if}
	</div>
	<!-- Actions -->

	<div class="actions-container">
		{#if (suggestionState === 'done' || suggestionState === 'ok' || storyComplete === true) && story.length > minStoryLength}
			<!-- Disclaimer -->
			<div transition:blur class="disclaimer-container">
				<!-- Checkmark -->
				<div class="checkmark-container">
					<Checkmark bind:checkValue={userAgreed} />
				</div>
				<div class="disclaimer-text">
					<p>{$_('submit_disclaimer')}</p>
				</div>
			</div>
			<!-- Buttons Container -->
			<div transition:blur class="disclaimer-btn-container">
				<div>
					<button
						disabled={!userAgreed}
						class="btn"
						onclick={() => {
							playUISound();
							handleSubmit();
						}}>{$_('submit_btn_submit')}</button
					>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.card-submit-container {
		width: 100%;
		min-height: 100vh;
		background-color: black;
		display: flex;
		flex-direction: column;
		padding: 0 10% 0 10%;
	}
	.question-container {
		margin-top: 80px;
		font-size: 16px;
		padding-bottom: 40px;
		border-bottom: 1px solid white;
	}
	.input-container {
		margin-top: 40px;
		font-size: 18px;
		font-family: 'Roboto Slab', serif;
	}

	.suggestions-container {
		margin-top: 40px;
		min-height: 150px;
		position: relative;
		display: flex;
		justify-content: end;
		align-items: flex-start;
	}
	.disclaimer-container {
		margin-top: 40px;
		font-size: 14px;
		display: grid;
		grid-template-columns: 40px 1fr;
		align-items: start;
		justify-items: start;
	}
	.disclaimer-btn-container {
		margin-top: 20px;
		justify-self: end;
		font-size: 16px;
		display: flex;
		flex-direction: column;
		align-items: end;
	}
	.btn {
		background-color: black;
		border-color: white;
		border-radius: 0px;
		color: white;
		min-width: 130px;
	}
	.btn:disabled {
		border-color: rgb(90, 90, 90);
		color: rgb(90, 90, 90);
	}

	.bubble {
		position: absolute;
		top: 0;
		right: 0;
		max-width: 80%;
		font-size: 16px;
		text-align: left;
		border-radius: 10px;
		padding: 10px;
	}

	.warning-bubble {
		color: #ffbcbc;
		background-color: #ffbcbc1a;
	}

	.loader-bubble {
		background-color: transparent;
	}

	.suggestions-bubble {
		color: #ffe7c3;
		background-color: #ffe7c31a;
	}

	.thank-you-bubble {
		color: #cfffcf;
		background-color: #cfffcf1a;
	}

	/* Media Queries */
	@media (min-width: 768px) {
		.card-submit-container {
			display: grid;
			grid-template-rows: 1fr 1fr 1fr;
			grid-template-columns: minmax(0, 1fr) 1fr;
			grid-template-areas:
				'question .'
				'input actions'
				'suggestions .';
		}

		.question-container {
			grid-area: question;
		}

		.input-container {
			grid-area: input;
			margin-top: 40px;
		}

		.suggestions-container {
			grid-area: suggestions;
			margin-top: 0;
		}

		.actions-container {
			grid-area: actions;
			display: flex;
			flex-direction: column;
			gap: 100px;
		}

		.disclaimer-container {
			margin-top: 0;
			padding: 0 100px 0 100px;
		}

		.disclaimer-btn-container {
			margin-top: 0;
			padding-top: 0;
			display: flex;
			align-self: end;
			justify-self: end;
		}

		.btn {
			width: 170px;
		}
	}
</style>
