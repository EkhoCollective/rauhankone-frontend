<script lang="ts">
	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import { goto } from '$app/navigation';

	let showLang = false;

	function handleToggleLang() {
		showLang = !showLang;
	}

	function handleToSubmit() {
		goto('/submit');
	}

	function handleToExplore() {
		goto('/explorer');
	}
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

{#if showLang}
	<div class="main-container lang-container">
		<CardLang toMain={handleToggleLang} />
	</div>
{/if}

<div class="main-container">
	<CardMain toLang={handleToggleLang} toSubmit={handleToSubmit} toExplore={handleToExplore} />
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
</style>
