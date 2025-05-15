<script lang="ts">
	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';
	import { submitData } from '$lib/utils/api';

	let showLang = false;
	let showSubmit = false;
	let showExplore = false;

	function handleToggleLang() {
		showLang = !showLang;
	}

	function handleToggleSubmit() {
		showSubmit = !showSubmit;
		handleGetData();
	}

	function handleToggleExplore() {
		showExplore = !showExplore;
	}

	let response = null;

	async function handleGetData() {
		response = await submitData();
		console.log('Response:', response);
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
