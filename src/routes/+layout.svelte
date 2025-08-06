<script lang="ts">
	// import { browser } from '$app/environment';
	import '../app.css';
	import '$lib/i18n';
	import { onMount } from 'svelte';
	// import { setContext } from 'svelte'
	import { locale, waitLocale, init } from 'svelte-i18n';
	import { getAuthToken } from '$lib/utils/api_token';
	import { apiRequest } from '$lib/utils/api_request';
	import CardError from '$lib/components/cards/CardError.svelte';

	import { setContext } from 'svelte';
	import type { LayoutProps } from './$types';
	// let { data }: LayoutProps = $props();

	let questions = $state(null);
	let raiseError = $state(false);

	// Set context at component initialization
	setContext('questions', () => questions);

	const API_QUESTIONS_OPTIONS = () => ({
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { question_type: 'starter' }
	});

	async function handleGetToken() {
		await getAuthToken()
			.then(() => {
				handleGetQuestions();
			})
			.catch((error) => {
				console.log('Error getting token', error);
				raiseError = true;
			});
	}

	async function handleGetQuestions() {
		await apiRequest(API_QUESTIONS_OPTIONS())
			.then((response) => {
				questions = response;
			})
			.catch((error) => {
				console.log('Error getting questions', error);
				raiseError = true;
			});
	}

	// import type { LayoutLoad } from './$types';

	// export const load: LayoutLoad = async () => {
	// 	if (browser) {
	// 		locale.set(window.navigator.language);
	// 	}
	// 	await waitLocale();
	// };

	init({
		fallbackLocale: 'en',
		initialLocale: 'en'
	});

	// onMount(() => {
	// 	if (browser) {
	// 		const savedLocale = localStorage.getItem('locale');
	// 		if (savedLocale) {
	// 			locale.set(savedLocale);
	// 		} else {
	// 			// const navigatorLang = window.navigator.language.split('-')[0]; // Get base language code
	// 			// FIX THIS BASED ON USER BROWSER LANGUAGE
	// 			// console.log(navigatorLang);
	// 			const lang_code = 'en';
	// 			localStorage.setItem('locale', lang_code);
	// 			locale.set(lang_code);
	// 		}
	// 	}
	// });

	let { children } = $props();

	onMount(() => {
		window.scrollTo(0, 0);
		handleGetToken();
	});

	$inspect(questions);
</script>

<!-- put the car error, the nav bar , and the audio icon here -->

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.ico" />
</svelte:head>

<div class="app">
	{@render children()}
</div>

<style>
	/* :global(body) {
		background-color: black;
		color: white;
		font-family: 'Roboto', sans-serif;
		overflow: hidden;
	} */

	.app {
		background-color: black;
		color: white;
		font-family: 'Roboto', sans-serif;
	}
	/* 
	.audio-icon-container {
		position: absolute;
		z-index: 100;
		bottom: 20px;
		left: 20px;
	}

	.app-container {
		height: 100vh;
	}

	.header-container {
		height: 50px;
		z-index: 1000;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}

	.card-container {
		height: 100%;
	}

	.lang-container {
		width: 100vw;
		height: 100vh;
		z-index: 2000;
		position: absolute;
		top: 0;
		left: 0;
		/* transform: translate(-50%, -50%); */
	/* } */
	/* 
	.error-container {
		width: 100vw;
		height: 100vh;
		z-index: 3000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	} */
</style>
