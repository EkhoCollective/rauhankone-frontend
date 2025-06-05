<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuthToken } from '$lib/utils/api_token';
	import { waitLocale } from 'svelte-i18n';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';

	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';

	// UI Toggles

	let showLang = $state(false);
	let showSubmit = $state(false);
	let showExplore = $state(false);

	// function handleToggle(state: boolean) {
	// 	return () => {
	// 		if (state === showLang) showLang = !showLang;
	// 		if (state === showSubmit) showSubmit = !showSubmit;
	// 		if (state === showExplore) showExplore = !showExplore;
	// 	};
	// }

	let handleToggleLang = () => {
		showLang = !showLang;
	};

	function handleToggleSubmit() {
		showSubmit = !showSubmit;
	}

	function handleToggleExplore() {
		showExplore = !showExplore;
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
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

{#if showLang}
	<div class="main-container lang-container">
		<CardLang closeLangCard={handleToggleLang} />
	</div>
{/if}

<!-- {#if showSubmit}
	<div class="main-container submit-container">
		<CardSubmit toggleLang2={handleToggleLang} toExplore={handleToggleExplore} />
	</div>
{/if}

{#if showExplore}
	<div class="main-container explore-container">
		<CardExplore />
	</div>
{/if} -->

{#await waitLocale()}
	<Loader />
{:then}
	<div class="main-container">
		<div class="header-container">
			<Header openLangCard={handleToggleLang} />
		</div>

		<div class="card-container">
			{#if showSubmit}
				<div class="submit-container">
					<CardSubmit toggleLang2={handleToggleLang} toExplore={handleToggleExplore} />
				</div>
			{/if}

			{#if showExplore}
				<div class="explore-container">
					<CardExplore />
				</div>
			{/if}

			{#if !showSubmit}
				<CardMain toSubmit={handleToggleSubmit} toExplore={handleToggleExplore} />
			{/if}
		</div>
		<div class="footer-container">
			<Footer />
		</div>
	</div>
{/await}

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

	.card-container {
		top: 50px;
	}

	.header-container {
		height: 50px;
		z-index: 9999;
	}

	.lang-container {
		z-index: 5000;
	}

	.submit-container {
		z-index: 2;
	}

	.explore-container {
		z-index: 3;
	}

	.footer-container {
		z-index: 4;
	}
</style>
