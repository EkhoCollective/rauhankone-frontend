<script>
	import { Canvas } from '@threlte/core';
	import Scene from '../lib/components/Scene.svelte';
	import Card from '$lib/components/Card.svelte';
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

<div class="homepage-title-card">
	<Card
		title="Layers in the Peace Machine"
		subtitle="... is part of the dynamic discourse about actions, choices, mutual interactions and power, which all greatly affect the processes of peace."
		btnText="Take Part"
	/>
</div>

<div class="homepage-img-container">
	<enhanced:img class="homepage-img" src="../lib/images/background_1.png" alt="An alt text" />
</div>

<!-- <div class="homepage-scene">
	<Canvas>
		<Scene />
	</Canvas>
</div> -->

<style>
	/* .homepage-scene {
		background-color: black;
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1; 
	} */

	.homepage-img-container {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.homepage-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.homepage-title-card {
		z-index: 9999;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
