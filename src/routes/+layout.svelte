<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { onMount, setContext } from 'svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { error } from '@sveltejs/kit';
	import { _, locale, waitLocale, init } from 'svelte-i18n';
	import { getAuthToken } from '$lib/utils/api_token';
	import { apiRequest } from '$lib/utils/api_request';
	import CardLang from '$lib/components/cards/CardLang.svelte';
	import CardError from '$lib/components/cards/CardError.svelte';
	import CardLoader from '$lib/components/cards/CardLoader.svelte';
	import Header from '$lib/components/mini-components/Header.svelte';
	import { Dialog } from "bits-ui";

	let { children } = $props();

	let questions = $state(null);
	// let raiseError = getContext('raiseError') as () => boolean;
	let showLang = $state(false);
	let transitionDuration = 500;
	let translateStories = $state(false);

	// Set context at component initialization
	setContext('questions', () => questions);

	init({
		fallbackLocale: 'en',
		initialLocale: 'en'
	});

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
			.catch((err) => {
				// console.log('Error getting token', error);
				// raiseError = true;
				throw error(500, 'Failed to get token');
			});
	}

	async function handleGetQuestions() {
		await apiRequest(API_QUESTIONS_OPTIONS())
			.then((response) => {
				questions = response;
			})
			.catch((err) => {
				// console.log('Error getting questions', error);
				// raiseError = true;
				throw error(500, 'Failed to get questions');
			});
	}

	// import type { LayoutLoad } from './$types';

	// export const load: LayoutLoad = async () => {
	// 	if (browser) {
	// 		locale.set(window.navigator.language);
	// 	}
	// 	await waitLocale();
	// };

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

	let handleToggleLangDialog = () => {
		showLang = !showLang;
	};

	onMount(() => {
		window.scrollTo(0, 0);
		handleGetToken();
	});

	// $inspect(questions);
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.ico" />
</svelte:head>

<div class="app">
	<!-- Loader -->
	{#await waitLocale()}
		<CardLoader />
	{:then}
		<!-- Error Card -->
		<!-- {#if raiseError()}
		<div transition:blur>
			<CardError errorMessage={$_('error_map')} />
		</div>
	{/if} -->
		<!-- Lang Card -->
		<!-- onclose={() => (showLang = false)} -->
		<!-- in:fade={{ duration: transitionDuration }} -->
		<!-- out:fade={{ duration: transitionDuration }} -->
		<!-- aria-modal={showLang} -->
			<Dialog.Root bind:open={showLang}>	
				<Dialog.Portal>
					<Dialog.Overlay/>
						<CardLang closeLangCard={handleToggleLangDialog} bind:translate={translateStories} />
				</Dialog.Portal>
			</Dialog.Root>
		<!-- Header -->
		<div class="header-container">
			<Header toggleLang={handleToggleLangDialog} showLang={showLang} />
		</div>

		<!-- Pages -->
		{#key page.url.pathname}
			<div
				class="page-container"
				in:fade={{ duration: transitionDuration }}
				out:fade={{ duration: transitionDuration }}
			>
				{@render children()}
			</div>
		{/key}
	{/await}
</div>

<style>
	.app {
		background-color: black;
		color: white;
		font-family: 'Roboto', sans-serif;
	}

	.header-container {
		height: 100px;
		z-index: 1000;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}

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
