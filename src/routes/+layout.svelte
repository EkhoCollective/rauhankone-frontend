<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { onMount } from 'svelte';
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
	import { Dialog } from 'bits-ui';
	import { setContext } from 'svelte';

	let { children } = $props();

	// let questions = $state(null);
	// let raiseError = getContext('raiseError') as () => boolean;
	let showLang = $state(false);
	let transitionDuration = 500;
	let translateStories = $state(false);

	// Navigation context state
	let navigationSource = $state<'main' | 'submit' | null>(null);
	let submittedStoryId = $state<string | null>(null);

	// Set navigation context
	setContext('navigation', {
		setSource: (source: 'main' | 'submit') => {
			navigationSource = source;
		},
		setSubmittedStoryId: (storyId: string) => {
			submittedStoryId = storyId;
		},
		getNavigationData: () => ({
			source: navigationSource,
			storyId: submittedStoryId
		}),
		clearNavigation: () => {
			navigationSource = null;
			submittedStoryId = null;
		}
	});

	// Set context at component initialization
	// setContext('questions', () => questions);

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
			// .then(() => {
			// 	handleGetQuestions();
			// })
			.catch((err) => {
				// console.log('Error getting token', error);
				// raiseError = true;
				throw error(500, 'Failed to get token');
			});
	}

	// async function handleGetQuestions() {
	// 	await apiRequest(API_QUESTIONS_OPTIONS())
	// 		.then((response) => {
	// 			questions = response;
	// 		})
	// 		.catch((err) => {
	// 			// console.log('Error getting questions', error);
	// 			// raiseError = true;
	// 			throw error(500, 'Failed to get questions');
	// 		});
	// }

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
		<!-- Lang Dialog -->
		<Dialog.Root bind:open={showLang}>
			<Dialog.Portal>
				<Dialog.Overlay>
					<CardLang closeLangCard={handleToggleLangDialog} bind:translate={translateStories} />
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>

		<!-- Header -->
		<header class="header-container">
			<Header toggleLang={handleToggleLangDialog} {showLang} />
		</header>

		<!-- Pages -->
		{#key page.url.pathname}
			<main
				class="page-container"
				in:fade={{ duration: transitionDuration }}
				out:fade={{ duration: transitionDuration }}
			>
				{@render children()}
			</main>
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
</style>
