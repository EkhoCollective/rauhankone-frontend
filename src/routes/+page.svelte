<script>
	import Card from '../lib/components/Card-Main.svelte';
	import { submitData } from '../lib/utils/api'; // Decoupled API helper

	let response = null;

	async function handleCardSubmit() {
		response = await submitData();
		console.log('Response:', response);
	}
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

<div class="homepage-title-card">
	<Card onSubmit={handleCardSubmit} />
</div>

<div class="homepage-img-container">
	<enhanced:img class="homepage-img" src="$lib/images/background_1.png" alt="An alt text" />
</div>

<!-- <div class="homepage-scene">
	<Canvas>
		<Scene />
	</Canvas>
</div> -->

<style>
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
