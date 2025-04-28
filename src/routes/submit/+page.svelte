<script lang="ts">
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import { goto } from '$app/navigation';

	function handleToMain() {
		goto('/');
	}

	function handleToExplore() {
		goto('/explorer');
	}
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

<div class="main-container">
	<CardSubmit toMain={handleToMain} toExplore={handleToExplore} />
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
</style>
