<script>
	import { Canvas } from '@threlte/core';
	import Scene from '../lib/Scene/Scene.svelte';
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

<div class="homepage-title-card">
	<h1>Layers in the Peace Machine</h1>
	<p>
		... is part of the dynamic discourse about actions, choices, mutual interactions and power,
		which all greatly affect the processes of peace.
	</p>

	<button class="btn btn-primary">Button</button>
</div>

<div class="homepage-scene">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	.homepage-scene {
		background-color: black;
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1; /* Ensure the canvas is behind other elements */
	}

	.homepage-title-card {
		z-index: 9999; /* Ensure this is on top of everything */
		position: relative; /* Ensure it is positioned above the canvas */
	}
</style>
