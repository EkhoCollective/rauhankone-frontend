<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { Globe } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';

	// API URL and options
	// check langselector
	// call get_question
	// call suggestions
	// submit add_story

	const API_QUESTIONS_OPTIONS = {
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: getLocaleFullName(), question_type: 'starter' }
	};

	const API_SUGGESTION_OPTIONS = {
		API_ENDPOINT: '/get_suggestion',
		API_METHOD: 'POST',
		REQUEST_BODY: { suggestion: null }
	};
	const API_ADD_STORY_OPTIONS = {
		API_ENDPOINT: '/add_story',
		API_METHOD: 'POST',
		REQUEST_BODY: { text: null, question: null, language: getLocaleFullName() }
	};

	// response_suggestion = await apiRequest( API_SUGGESTION_OPTIONS);
	// console.log('Response:', response_suggestion);

	// response_add_story = await apiRequest( API_ADD_STORY_OPTIONS);
	// console.log('Response:', response_add_story);

	function handleSubmit() {
		console.log('Submit');
	}

	async function handleGetQuestions() {
		await apiRequest(API_QUESTIONS_OPTIONS).then((response) => {
			console.log('Response:', response);
		});
		// console.log('Get Questions');
	}

	function handleGetSuggestions() {
		console.log('Get Suggestions');
	}

	onMount(() => {
		handleGetQuestions();
		// handleGetSuggestions();
	});

	export let toggleLang = () => {};
	export let toExplore = () => {};
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" on:click={toggleLang}><Globe /></button>
		</div>
		<!-- Main Text -->
		<div class="card-text-container">
			<p>
				{m.submit_info()}
			</p>
		</div>
		<!-- Input Area -->
		<div class="card-input-container">
			<textarea rows="10" cols="50" placeholder="Your memory here..."></textarea>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			<div>
				<button class="btn" on:click={toExplore}>{m.submit()}</button>
			</div>
		</div>
		<!-- Footer -->
		<div class="card-footer-container">
			<p>{m.read_more()}</p>
			<p>© Ekho Collective</p>
			<p>GDPR</p>
		</div>
	</div>
</div>

<!-- NOTES
 
- change icon
- check font style
- buttons styling
- title separtion to paraglide schema

-->

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
