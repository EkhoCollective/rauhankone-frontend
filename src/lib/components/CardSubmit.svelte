<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import { CircleAlert } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import DOMPurify from 'dompurify';

	let { toExplore } = $props();

	let question = $state<string | null>(null);
	let story = $state('');
	let suggestion = $state('');

	const API_QUESTIONS_OPTIONS = () => ({
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: 'Any', question_type: 'starter' }
	});

	const API_SUGGESTION_OPTIONS = () => ({
		API_ENDPOINT: '/suggestion',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: getLocaleFullName(), suggestion: story }
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
			console.log('Get Questions Response:', response);
			getLangFilteredQuestion(response);
		});
	}

	async function handleSubmit() {
		await apiRequest(API_ADD_STORY_OPTIONS()).then((response) => {
			console.log('Add Story Response:', response);
		});
		toExplore();
	}

	async function handleGetSuggestions() {
		await apiRequest(API_SUGGESTION_OPTIONS()).then((response) => {
			console.log('Get Suggestions Response:', response);
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

	// function on_key_up(event: KeyboardEvent) {
	// 	let timer: any;
	// 	const input = document.querySelector('#story-input');
	// 	input?.addEventListener('keyup', function () {
	// 		clearTimeout(timer);
	// 		timer = setTimeout(() => {
	// 			// handleGetSuggestions();
	// 			console.log('timer');
	// 			// timer.enabled = false;
	// 		}, 1000);
	// 	});

	// 	window.addEventListener('keyup', on_key_up);

	// 	return {
	// 		destroy() {
	// 			window.removeEventListener('keyup', on_key_up);
	// 		}
	// 	};
	// }

	onMount(() => {
		handleGetQuestions();
	});

	// $inspect('isLoading', isLoading);
</script>

<!-- <svelte:window on:keyup={on_key_up} /> -->

<!-- <div id="test-div">
	<p>test</p>
</div> -->

<!-- {#await waitLocale()}
	<Loader />
{:then} -->
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
		<textarea
			id="story-input"
			rows="10"
			cols="50"
			placeholder={$_('input_placeholder')}
			bind:value={story}
		></textarea>
	</div>
	<!-- Buttons Container -->
	<div class="card-btn-container">
		<div>
			<button class="btn" onclick={() => handleSubmit()}>{$_('btn_submit')}</button>
		</div>
	</div>
	<!-- Disclaimer -->
	<div class="card-disclaimer-container">
		<div class="card-disclaimer-icon">
			<CircleAlert />
		</div>
		<div class="card-disclaimer-text">
			<p>{$_('disclaimer')}</p>
		</div>
	</div>
</div>

<!-- {/await} -->

<style>
	.card-submit-container {
		width: 100%;
		height: calc(100vh - 50px);
		background-color: black;
		display: grid;
		grid-template-rows: 1fr 1fr 1fr 1fr;
		padding: 0 10% 0 10%;
	}
	.card-input-container {
		grid-row-start: 2;
		border: 1px solid white;
	}
	textarea {
		width: 100%;
		height: 200px;
		padding: 10px;
	}
	.card-question-container {
		font-size: 0.75em;
		grid-row-start: 1;
		align-self: center;
	}
	.card-btn-container {
		grid-row-start: 3;
		justify-self: end;
		padding-top: 20px;
		font-size: 0.75em;
	}
	.btn {
		background-color: black;
		border-color: white;
	}
	.card-disclaimer-container {
		grid-row-start: 4;
		font-size: 0.75em;
		display: grid;
		grid-template-columns: 40px 1fr;
		align-items: start;
		justify-items: start;
	}

	.card-disclaimer-icon {
		grid-column-start: 1;
	}
	.card-disclaimer-text {
		grid-column-start: 2;
	}
</style>
