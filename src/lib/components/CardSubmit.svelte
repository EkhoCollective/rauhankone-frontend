<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import DOMPurify from 'dompurify';
	import Checkmark from '$lib/components/mini-components/Checkmark.svelte';
	import Textarea from '$lib/components/mini-components/Textarea.svelte';
	import Loader from '$lib/components/mini-components/Loader.svelte';
	import { blur } from 'svelte/transition';

	let { toExplore } = $props();

	let question = $state<string | null>(null);
	let story = $state('');
	let suggestion = $state('');
	let checked = $state(false);
	let suggestionLimit = $state(false);
	let isTyping = $state(false);
	let isLoadingSuggestions = $state(false);
	let typingTimer: number | null = null;
	let storyComplete = $state(false);

	const API_QUESTIONS_OPTIONS = () => ({
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: 'Any', question_type: 'starter' }
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
			question: question,
			language: getLocaleFullName()
		}
	});

	async function handleGetQuestions() {
		await apiRequest(API_QUESTIONS_OPTIONS()).then((response) => {
			// console.log('Get Questions Response:', response);
			getLangFilteredQuestion(response);
		});
	}

	async function handleSubmit() {
		if (checked === true) {
			await apiRequest(API_ADD_STORY_OPTIONS()).then((response) => {
				console.log('Add Story Response:', response);
			});
			toExplore();
		}
	}

	async function handleGetSuggestions() {
		await apiRequest(API_SUGGESTION_OPTIONS()).then((response) => {
			suggestion = response.suggestion;
			isLoadingSuggestions = false;
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

	locale.subscribe(() => {
		handleGetQuestions();
	});

	// Function to handle typing detection
	function handleTyping() {
		isTyping = true;
		isLoadingSuggestions = false; // Reset loading state when typing starts

		// Clear existing timer
		if (typingTimer) {
			clearTimeout(typingTimer);
		}

		// Set new timer to detect when user stops typing
		typingTimer = setTimeout(() => {
			isTyping = false;
			if (suggestionLimit === false) {
				if (suggestion.length > 0) {
					storyComplete = true;
					isLoadingSuggestions = false;
					return;
				} else {
					// Show loader after 500ms of stopping typing
					setTimeout(() => {
						isLoadingSuggestions = true;
						// Then call the API
						handleGetSuggestions();
					}, 500);
				}
			}
		}, 1000); // 1 second delay to detect stopping typing
	}

	onMount(() => {
		handleGetQuestions();
	});

	// Watch for changes in the story text
	$effect(() => {
		if (story.length < 30 && story.length > 0) {
			suggestionLimit = true;
		} else {
			suggestionLimit = false;
		}
		if (story && storyComplete === false) {
			handleTyping();
		}
		// If user deletes all text, reset storyComplete and suggestion
		if (story.length === 0) {
			storyComplete = false;
			suggestion = '';
		}
	});

	$inspect(
		// 'storyComplete',
		// storyComplete,
		// 'isTyping',
		// isTyping,
		// 'suggestionLimit',
		// suggestionLimit,
		'isLoadingSuggestions',
		isLoadingSuggestions
	);
</script>

<div class="card-submit-container">
	<!-- Main Text -->
	<div class="card-question-container">
		{#if question}
			<p>{question}</p>
		{:else}
			<p>ERROR. Please reload the page.</p>
		{/if}
	</div>
	<!-- Input Area -->
	<div class="card-input-container">
		<Textarea bind:textValue={story} minHeight="100px" />
	</div>
	<!-- Suggestions -->
	<div class="card-suggestions-container">
		<!-- Show warning if story is too short -->
		{#if suggestionLimit}
			<p transition:blur class="suggestion-limit-text">
				{$_('type_more')}
			</p>
		{/if}
		<!-- Show loader when waiting for suggestions -->
		{#if isLoadingSuggestions && story.length > 0 && !suggestionLimit}
			<div transition:blur class="loader-container">
				<Loader color="white" pulseSize="30px" pulseTiming="1s" />
			</div>
		{/if}
		<!-- Show suggestion if user has typed something -->
		{#if storyComplete === false && isTyping === false && suggestion && story.length > 0 && !isLoadingSuggestions}
			<div transition:blur>
				<p>{suggestion}</p>
				<p>{$_('please_extend')}</p>
			</div>
		{/if}
		<!-- Show thank you message if user has finished the story -->
		{#if storyComplete && story.length > 0}
			<p transition:blur class="thank-you-text">
				{$_('submit_toast')}
			</p>
		{/if}
	</div>
	<!-- Disclaimer -->
	<div class="card-disclaimer-container">
		<!-- Checkmark -->
		<div class="card-checkmark-container">
			<Checkmark bind:checkValue={checked} />
		</div>
		<div class="card-disclaimer-text">
			<p>{$_('disclaimer')}</p>
		</div>
	</div>
	<!-- Buttons Container -->
	<div class="card-btn-container">
		<div>
			<button disabled={!checked} class="btn" onclick={() => handleSubmit()}
				>{$_('btn_submit')}</button
			>
		</div>
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
	.card-question-container {
		margin-top: calc(50px + 80px); /* fix this */
		font-size: 16px;
		align-self: center;
	}
	.card-input-container {
		margin-top: 50px;
		font-size: 18px;
		font-family: 'Roboto Slab', serif;
	}

	.card-suggestions-container {
		margin-top: 50px;
		font-size: 14px;
		min-height: 100px;
		text-align: right;
	}

	.card-disclaimer-container {
		margin-top: 50px;
		font-size: 14px;
		display: grid;
		grid-template-columns: 40px 1fr;
		align-items: start;
		justify-items: start;
	}
	.card-btn-container {
		margin-top: 50px;
		justify-self: end;
		padding-top: 20px;
		font-size: 16px;
		display: flex;
		flex-direction: column;
	}
	.btn {
		background-color: black;
		border-color: white;
		border-radius: 0px;
	}
	.btn:disabled {
		border-color: gray;
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
</style>
