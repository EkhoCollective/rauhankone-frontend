<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '../lib/components/ScenePoints.svelte';
	import CardMain from '../lib/components/CardMain.svelte';

	function handleCardSubmit() {
		console.log('Card submitted');
	}
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

<div class="main-container">
	<CardMain toSubmit={handleCardSubmit} />
</div>

<div style="width: 100%; height: 100vh;">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	.main-container {
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
