<script lang="ts">
	import { page } from '$app/state';
	import CardLang from '$lib/components/cards/CardLang.svelte';
	import CardLoader from '$lib/components/cards/CardLoader.svelte';
	import Header from '$lib/components/mini-components/Header.svelte';
	import '$lib/i18n';
	import { getAuthToken } from '$lib/utils/api_token';
	import { Dialog } from "bits-ui";
	import { onMount } from 'svelte';
	import { init, waitLocale, _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import '../app.css';
	import { customErrorHandler } from '$lib/utils/customErrrorHandler';

	let { children } = $props();
	let showLang = $state(false);
	let transitionDuration = 100;
	let translateStories = $state(false);
	
	

	init({
		fallbackLocale: 'en',
		initialLocale: 'en'
	});


	async function handleGetToken() {
		await getAuthToken()
			.catch((err) => {
				console.error('Error getting token:', err);
				customErrorHandler($_("error.authFailed"), err.code);
			});
	}



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
						<CardLang closeLangCard={handleToggleLangDialog} bind:translate={translateStories} />
				</Dialog.Portal>
			</Dialog.Root>
		
		
			<!-- Header -->
		<header class="header-container">
			<Header toggleLang={handleToggleLangDialog} showLang={showLang} />
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
