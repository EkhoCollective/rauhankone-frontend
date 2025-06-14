<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import DOMPurify from 'dompurify';
	import Checkmark from '$lib/components/mini-components/Checkmark.svelte';
	import Textarea from '$lib/components/mini-components/Textarea.svelte';

	let { toExplore } = $props();

	let question = $state<string | null>(null);
	let story = $state('');
	let suggestion = $state('');
	let checked = $state(false);
	let showThankyou = $state(false);
	let suggestionLimit = $state(false);

	$effect(() => {
		if (story.length < 20) {
			suggestionLimit = true;
		} else {
			suggestionLimit = false;
			// handleGetSuggestions();
		}
		// console.log('story.length', story.length);
	});

	// function test() {
	// 	// let a = 'dsfjlhasdfjhaldkf';
	// 	console.log('story.length', story.length);
	// 	// console.log('story', story);
	// }

	// let alertDisclaimer = $state(false);
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
			showThankyou = true;
			setTimeout(() => {
				showThankyou = false;
			}, 1000);
		}
		// 		else {
		// 			alertDisclaimer = true;
		// 		}
	}

	async function handleGetSuggestions() {
		await apiRequest(API_SUGGESTION_OPTIONS()).then((response) => {
			console.log('Get Suggestions Response:', response);
			suggestion = response.suggestion;
			// test();
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
		// window.scrollTo(0, 0);
		handleGetQuestions();
	});

	// $inspect('checked', checked);
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
		<Textarea bind:textValue={story} minHeight="100px" />
	</div>
	<!-- Suggestions -->
	<div class="card-suggestions-container">
		<button class="btn-suggestions" onclick={() => handleGetSuggestions()}> sugg </button>
		{#if suggestionLimit}
			<p>Please enter at least 20 characters to get suggestions</p>
		{:else}
			<p>
				Thanks for sharing your memory. Now it’s time to join it with others by clicking the button
				below.
			</p>
			<p>{suggestion}</p>
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

<!-- {/await} -->

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
		font-size: 16px;
	}

	.card-suggestions-container {
		margin-top: 50px;
		font-size: 14px;
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
</style>
