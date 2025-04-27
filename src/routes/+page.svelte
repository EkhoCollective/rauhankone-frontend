<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '../lib/components/ScenePoints.svelte';
	import CardMain from '../lib/components/CardMain.svelte';
	import CardLang from '../lib/components/CardLang.svelte';

	let showLang = false;
	let showSubmit = false;
	let showExplore = false;

	function handleToggleLang() {
		showLang = !showLang;
	}

	function handleToggleSubmit() {
		showSubmit = !showSubmit;
	}

	function handleToggleExplore() {
		showExplore = !showExplore;
	}
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

<!-- {#if showLang}
	<div class="main-container lang-container">
		<CardLang toMain={handleToggleLang} />
	</div>
{/if} -->

<!-- {#if !showExplore || !showLang} -->
<!-- <div class="main-container">
	<CardMain
		toLang={handleToggleLang}
		toSubmit={handleToggleSubmit}
		toExplore={handleToggleExplore}
	/>
</div> -->
<!-- {/if} -->

<div style="width: 100%; height: 100vh;">
	<Canvas>
		<Scene />
	</Canvas>
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
