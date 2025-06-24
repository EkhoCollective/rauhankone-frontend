<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import DOMPurify from 'dompurify';
	import Checkmark from '$lib/components/mini-components/Checkmark.svelte';
	import Textarea from '$lib/components/mini-components/Textarea.svelte';
	import Loader from '$lib/components/mini-components/Loader.svelte';
	import { blur } from 'svelte/transition';

	let { toExplore, questionsData } = $props();

	let question = $state<string | null>(null);
	let story = $state('');
	let suggestion = $state('');
	let userAgreed = $state(false);
	let isTyping = $state(false);
	let typingTimer = $state(750);
	let storyComplete = $state(false);
	let minStoryLength = $state(30);
	let suggestionState = $state('off');

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
			question: question,
			language: getLocaleFullName()
		}
	});

	async function handleSubmit() {
		if (userAgreed === true) {
			await apiRequest(API_ADD_STORY_OPTIONS()).then((response) => {
				console.log('Add Story Response:', response);
			});
			toExplore();
		}
	}

	async function handleGetSuggestions() {
		await apiRequest(API_SUGGESTION_OPTIONS()).then((response) => {
			suggestion = response.suggestion;
			console.log('Suggestion request complete');
			// isLoadingSuggestions = false;
			suggestionState = 'ok';
		});
	}

	function getLangFilteredQuestion(obj: any) {
		const questionsArray = obj.questions;

		if (Array.isArray(questionsArray) && questionsArray.length > 0) {
			const currentLocale = getLocaleFullName();
			const filteredQuestions = questionsArray.filter((q) => q.language === currentLocale);

			if (filteredQuestions.length > 0) {
				const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
				question = filteredQuestions[randomIndex].text;
			} else {
				// Fallback: if no questions for the current locale, pick a random one from all questions
				console.warn(
					`No questions found for locale: ${currentLocale}. Displaying a random question from all available.`
				);
				const randomIndex = Math.floor(Math.random() * questionsArray.length);
				question = questionsArray[randomIndex].text;
			}
		} else {
			console.error('Questions array is missing or empty in the response:', obj);
			question = 'No questions available at the moment.'; // Default message
		}
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
				// isLoadingSuggestions = true;
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
	// Suggestion State:
	// off: no suggestion because is not typing and there is no text
	// warning: story is too short and user has stopped typing
	// loading: loading suggestion hen the text is longer than the minStoryLength and the user has stopped typing
	// ok: suggestion received
	// done: thank you message when the user has edited the story and the story is complete

	// Watch for changes in the story text
	$effect(() => {
		handleTyping();
	});

	onMount(() => {
		getLangFilteredQuestion(questionsData);
	});

	$inspect(
		'isTyping',
		isTyping,
		'suggestionState',
		suggestionState,
		'storyComplete',
		storyComplete
	);
</script>

<div class="card-submit-container">
	<!-- Main Text -->
	<div class="card-question-container">
		{#if question && question.length > 0}
			<p>{question}</p>
		{:else}
			<p>{$_('error_db')}</p>
		{/if}
	</div>
	<!-- Input Area -->
	<div class="card-input-container">
		<Textarea
			bind:textValue={story}
			minHeight="200px"
			debounceTime={typingTimer}
			bind:typingActive={isTyping}
		/>
	</div>
	<!-- Suggestions -->
	{#if suggestionState !== 'off'}
		<div transition:blur class="card-suggestions-container">
			<!-- Show warning if story is too short -->
			{#if suggestionState === 'warning'}
				<div transition:blur class="suggestion-limit-text">
					{$_('type_more')}
				</div>
			{/if}
			<!-- Show loader when waiting for suggestions -->
			{#if suggestionState === 'loading'}
				<div transition:blur class="loader-container">
					<Loader color="white" pulseSize="30px" pulseTiming="1s" />
				</div>
			{/if}
			<!-- Show suggestion if user has typed something -->
			{#if suggestionState === 'ok'}
				<div transition:blur>
					<p>{suggestion}</p>
					<p>{$_('please_extend')}</p>
				</div>
			{/if}
			<!-- Show thank you message if user has finished the story -->
			{#if suggestionState === 'done'}
				<p transition:blur class="thank-you-text">
					{$_('submit_toast')}
				</p>
			{/if}
		</div>
	{/if}
	<!-- Actions -->
	{#if (suggestionState === 'done' || suggestionState === 'ok' || storyComplete === true) && story.length > minStoryLength}
		<div class="card-actions-container">
			<!-- Disclaimer -->
			<div class="card-disclaimer-container">
				<!-- Checkmark -->
				<div class="card-checkmark-container">
					<Checkmark bind:checkValue={userAgreed} />
				</div>
				<div class="card-disclaimer-text">
					<p>{$_('disclaimer')}</p>
				</div>
			</div>
			<!-- Buttons Container -->
			<div class="card-btn-container">
				<div>
					<button disabled={!userAgreed} class="btn" onclick={handleSubmit}
						>{$_('btn_submit')}</button
					>
				</div>
			</div>
		</div>
	{/if}
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
	.card-question-container {
		margin-top: 80px;
		font-size: 16px;
		align-self: center;
		padding-bottom: 40px;
		border-bottom: 1px solid white;
	}
	.card-input-container {
		margin-top: 40px;
		font-size: 18px;
		font-family: 'Roboto Slab', serif;
	}

	.card-suggestions-container {
		align-self: end;
		margin-top: 40px;
		max-width: 80%;
		font-size: 16px;
		min-height: 50px;
		text-align: left;
		background-color: rgb(15, 15, 15);
		border-radius: 10px;
		padding: 10px;
	}

	.card-disclaimer-container {
		margin-top: 40px;
		font-size: 14px;
		display: grid;
		grid-template-columns: 40px 1fr;
		align-items: start;
		justify-items: start;
	}
	.card-btn-container {
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

	.suggestion-limit-text {
		color: #ff7d7d;
	}

	.thank-you-text {
		color: #71f771;
	}

	.loader-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 768px) {
		.card-submit-container {
			display: grid;
			grid-template-rows: 1fr 1fr 1fr;
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'question .'
				'input actions'
				'suggestions .';
		}

		.card-question-container {
			grid-area: question;
		}

		.card-input-container {
			grid-area: input;
			margin-top: 0;
		}

		.card-suggestions-container {
			grid-area: suggestions;
			margin-top: 0;
		}

		.card-actions-container {
			grid-area: actions;
			display: flex;
			flex-direction: column;
			gap: 100px;
		}

		.card-disclaimer-container {
			margin-top: 0;
			padding: 0 100px 0 100px;
		}

		.card-btn-container {
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
