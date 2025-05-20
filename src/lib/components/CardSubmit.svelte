<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Globe } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';

	let { toExplore, toggleLang2 } = $props();

	let question = $state<string | null>(null);
	let story = $state('');
	let suggestion = $state('');

	const API_QUESTIONS_OPTIONS = () => ({
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: getLocaleFullName(), question_type: 'starter' }
	});

	const API_SUGGESTION_OPTIONS = () => ({
		API_ENDPOINT: '/get_suggestion',
		API_METHOD: 'POST',
		REQUEST_BODY: { suggestion: story }
	});

	const API_ADD_STORY_OPTIONS = () => ({
		API_ENDPOINT: '/add_story',
		API_METHOD: 'POST',
		REQUEST_BODY: { text: story, question: question, language: getLocaleFullName() }
	});

	async function handleGetQuestions() {
		await apiRequest(API_QUESTIONS_OPTIONS()).then((response) => {
			console.log('Get Questions Response:', response);
			question = response.questions[0].text;
		});
	}

	async function handleSubmit() {
		await apiRequest(API_ADD_STORY_OPTIONS()).then((response) => {
			console.log('Add Story Response:', response);
		});
		// toExplore(true);
	}

	async function handleGetSuggestions() {
		await apiRequest(API_SUGGESTION_OPTIONS()).then((response) => {
			console.log('Get Suggestions Response:', response);
		});
	}

	onMount(() => {
		handleGetQuestions();
	});
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" onclick={toggleLang2(true)}><Globe /></button>
		</div>
		<!-- Main Text -->
		<div class="card-text-container">
			<p>{question}</p>
		</div>
		<!-- Input Area -->
		<div class="card-input-container">
			<textarea rows="10" cols="50" placeholder="Your memory here..." bind:value={story}></textarea>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			<div>
				<button class="btn" onclick={handleSubmit}>{$_('submit')}</button>
			</div>
		</div>
		<!-- Footer -->
		<div class="card-footer-container">
			<p>{$_('read_more')}</p>
			<p>© Ekho Collective</p>
			<p>GDPR</p>
		</div>
	</div>
</div>

<style>
	.card {
		width: 100%;
		height: 100%;
		background-color: black;
		display: flex;
	}
	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 25px;
	}

	.card-header-container {
		display: grid;
		justify-items: end;
	}

	.card-input-container {
		margin: 10% 0 10% 0;
		border: 1px solid white;
	}

	textarea {
		width: 100%;
		height: 200px;
	}
	.card-text-container {
		font-size: 0.75em;
		margin: 0 0 10% 0;
	}
	.card-btn-container {
		display: grid;
		grid-template-columns: 1fr;
		align-items: start;
		justify-items: end;
	}
	.btn {
		background-color: black;
		border-color: white;
	}

	.btn-lang {
		border: none;
		box-shadow: none;
	}

	.card-footer-container {
		margin-top: 50%;
		font-size: 0.75em;
	}
</style>
