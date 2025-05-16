<script lang="ts">
	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';
	import { getAuthToken } from '$lib/utils/api_token';
	import { apiRequest } from '$lib/utils/api_request';

	// UI Toggles

	let showLang = false;
	let showSubmit = false;
	let showExplore = false;

	// API Responses

	let response = null;
	let response_clusters = null;
	let response_questions = null;
	let response_suggestion = null;
	let response_add_story = null;
	let response_get_stories = null;

	// API URL and options

	const API_URL = 'https://peacemachine.eu';
	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: 'Any', max_stories: 100, story: null }
	};

	const API_QUESTIONS_OPTIONS = {
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: 'Any' }
	};

	const API_SUGGESTION_OPTIONS = {
		API_ENDPOINT: '/get_suggestion',
		API_METHOD: 'POST',
		REQUEST_BODY: { suggestion: null }
	};
	const API_ADD_STORY_OPTIONS = {
		API_ENDPOINT: '/add_story',
		API_METHOD: 'POST',
		REQUEST_BODY: { question: null, text: null, language: null }
	};
	const API_GET_STORIES_OPTIONS = {
		API_ENDPOINT: '/get_stories',
		API_METHOD: 'GET',
		REQUEST_BODY: { language: 'Any', max_stories: 100 }
	};

	function handleToggleLang() {
		showLang = !showLang;
	}

	function handleToggleSubmit() {
		// showSubmit = !showSubmit;
		handleGetData();
	}

	function handleToggleExplore() {
		showExplore = !showExplore;
	}

	async function handleGetData() {
		response = await getAuthToken(API_URL).then((response) => {
			console.log('Response:', response);
		});

		response_clusters = await apiRequest(API_URL, API_CLUSTERS_OPTIONS);
		console.log('Response:', response_clusters);

		response_questions = await apiRequest(API_URL, API_QUESTIONS_OPTIONS);
		console.log('Response:', response_questions);

		response_suggestion = await apiRequest(API_URL, API_SUGGESTION_OPTIONS);
		console.log('Response:', response_suggestion);

		response_add_story = await apiRequest(API_URL, API_ADD_STORY_OPTIONS);
		console.log('Response:', response_add_story);

		response_get_stories = await apiRequest(API_URL, API_GET_STORIES_OPTIONS);
		console.log('Response:', response_get_stories);
	}
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

{#if showLang}
	<div class="main-container lang-container">
		<CardLang toggleLang={handleToggleLang} />
	</div>
{/if}

{#if showSubmit}
	<div class="main-container submit-container">
		<CardSubmit toggleLang={handleToggleLang} toExplore={handleToggleExplore} />
	</div>
{/if}

{#if showExplore}
	<div class="main-container explore-container">
		<CardExplore />
	</div>
{/if}

<div class="main-container">
	<CardMain
		toLang={handleToggleLang}
		toSubmit={handleToggleSubmit}
		toExplore={handleToggleExplore}
	/>
</div>

<style>
	.main-container {
		width: 100vw;
		height: 100vh;
		z-index: 1;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.lang-container {
		z-index: 9999;
	}

	.submit-container {
		z-index: 2;
	}

	.explore-container {
		z-index: 3;
	}
</style>
