<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/ScenePoints.svelte';
	import Icon from 'svelte-awesome';
	import close from 'svelte-awesome/icons/close';
	import { goto } from '$app/navigation';

	function handleToMain() {
		goto('/');
	}
</script>

<div class="main-container">
	<!-- Header/Language Selector -->
	<div class="card-header-container">
		<button class="btn btn-lang" on:click={handleToMain}><Icon data={close} scale={1} /> </button>
	</div>
</div>

<div style="width: 100%; height: 100vh;">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	.main-container {
		width: 100vw;
		height: 40px;
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
		padding: 25px;
		/* transform: translate(-50%, -50%); */
	}

	.card-header-container {
		display: grid;
		justify-items: end;
	}

	.btn {
		background-color: black;
		border-color: white;
		/* margin-bottom: 20px; */
	}
</style>
