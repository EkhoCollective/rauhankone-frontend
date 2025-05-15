<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/visual-module/ScenePointsSample.svelte';
</script>

<div class="scene-container">
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
