<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuthToken } from '$lib/utils/api_token';
	import { _, waitLocale } from 'svelte-i18n';
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';
	import { fade } from 'svelte/transition';

	// UI Toggle states
	let showLang = $state(false);
	let showSubmit = $state(false);
	let showExplore = $state(false);
	let transitionDuration = 500; // milliseconds

	let handleToggleLang = () => {
		showLang = !showLang;
	};

	function handleToggleSubmit() {
		showSubmit = !showSubmit;
	}

	function handleToggleExplore() {
		showExplore = !showExplore;
		showSubmit = false;
	}

	function handleBackToHome() {
		showSubmit = false;
		showExplore = false;
	}

	async function handleGetToken() {
		await getAuthToken();
	}

	function setShowLang(state: boolean) {
		showLang = state;
	}

	onMount(() => {
		handleGetToken();
	});
	// Console log to check state changes in svelte
	// $inspect('showSubmit', showSubmit, 'showExplore', showExplore, 'showLang', showLang);
</script>

<svelte:head>
	<title>{$_('rk_title')} | {$_('rk_layer')} | Oulu 2026</title>
</svelte:head>

<!-- Lnagauge Selector Card -->
{#if showLang}
	<div transition:fade={{ duration: transitionDuration }} class="lang-container">
		<CardLang closeLangCard={handleToggleLang} />
	</div>
{/if}

<!-- Loader -->
{#await waitLocale()}
	<Loader />
{:then}
	<div transition:fade={{ duration: transitionDuration }} class="app-container">
		<div class="header-container">
			<Header
				toggleLang={handleToggleLang}
				backToHome={handleBackToHome}
				showBackBtn={showSubmit || showExplore}
			/>
		</div>

		<div class="card-container">
			{#if showSubmit}
				<div transition:fade={{ duration: transitionDuration }} class="submit-container">
					<CardSubmit toExplore={handleToggleExplore} />
				</div>
			{/if}

			{#if showExplore}
				<div transition:fade={{ duration: transitionDuration }} class="explore-container">
					<CardExplore />
				</div>
			{/if}

			{#if !showSubmit && !showExplore}
				<div transition:fade={{ duration: transitionDuration }} class="main-container">
					<CardMain toSubmit={handleToggleSubmit} toExplore={handleToggleExplore} />
				</div>
			{/if}
		</div>
	</div>
{/await}

<style>
	.app-container {
		/* width: 100vw; */
		height: 100vh;
		display: grid;
		grid-template-rows: 50px 1fr;
		/* z-index: 1; */
		/* position: absolute; */
		/* top: 50%; */
		/* left: 50%; */
		/* transform: translate(-50%, -50%); */
	}

	.header-container {
		height: 100%;
		grid-row-start: 1;
	}

	.card-container {
		/* height: 100%;
		max-height: calc(100vh - 50px); */
		grid-row-start: 2;
	}

	.lang-container {
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	/* 
	.submit-container {
		z-index: 2;
	}

	.explore-container {
		z-index: 3;
	} */

	/* .footer-container {
		z-index: 4;
	} */
</style>
