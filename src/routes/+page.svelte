<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuthToken } from '$lib/utils/api_token';
	import { waitLocale } from 'svelte-i18n';
	import { _ } from 'svelte-i18n';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';

	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';

	// UI Toggle states

	let showLang = $state(false);
	let showSubmit = $state(false);
	let showExplore = $state(false);

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

	$inspect('showSubmit', showSubmit, 'showExplore', showExplore, 'showLang', showLang);
</script>

<svelte:head>
	<title>{$_('rk_title')} | Oulu 2026</title>
</svelte:head>

<!-- Lnagauge Selector Card -->
{#if showLang}
	<div class="main-container lang-container">
		<CardLang closeLangCard={handleToggleLang} />
	</div>
{/if}

<!-- Loader -->
{#await waitLocale()}
	<Loader />
{:then}
	<div class="main-container">
		<div class="header-container">
			<Header
				toggleLang={handleToggleLang}
				backToHome={handleBackToHome}
				showBackBtn={showSubmit || showExplore}
			/>
		</div>

		<div class="card-container">
			{#if showSubmit}
				<div class="submit-container">
					<CardSubmit toExplore={handleToggleExplore} />
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
		<!-- Footer -->
		{#if showSubmit === false && showExplore === false}
			<div class="footer-container">
				<Footer />
			</div>
		{/if}
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
