<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/visual-module/ScenePoints.svelte';
	import Thankyou from '$lib/components/mini-components/Thankyou.svelte';
	import { onMount } from 'svelte';

	let { showThankyou = $bindable(false) } = $props();

	onMount(() => {});
</script>

<div class="scene-container">
	{#if showThankyou}
		<Thankyou />
	{/if}
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	.scene-container {
		width: 100%;
		height: 100vh;
		background-color: black;
	}
</style>
