<script lang="ts">
	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';
	import { getAuthToken } from '$lib/utils/api_token';
	import { getClusters } from '$lib/utils/api_clusters';

	let showLang = false;
	let showSubmit = false;
	let showExplore = false;

	const API_URL = 'https://peacemachine.eu';
	const API_CLUSTERS_OPTIONS = { language: 'Any', max_stories: 100, story: null };

	function handleToggleLang() {
		showLang = !showLang;
	}

	function handleToggleSubmit() {
		showSubmit = !showSubmit;
		handleGetData();
	}

	function handleToggleExplore() {
		showExplore = !showExplore;
	}

	let response = null;
	let response_clusters = null;

	async function handleGetData() {
		response = await getAuthToken(API_URL);
		console.log('Response:', response);
		if (response) {
			const token = response.token;
			console.log('Token:', token);
			// localStorage.setItem('token', token);
		} else {
			console.error('Failed to get token');
		}

		// getClusters(API_URL, API_CLUSTERS_OPTIONS);
		response_clusters = await getClusters(API_URL, API_CLUSTERS_OPTIONS);
		console.log('Clusters:', response_clusters);
		if (response_clusters) {
			const clusters = response_clusters.clusters;
			console.log('Clusters:', clusters);
			// localStorage.setItem('clusters', JSON.stringify(clusters));
		} else {
			console.error('Failed to get clusters');
		}

		// // For backward compatibility (deprecated)
		// export async function getToken() {
		//   console.warn('getToken() is deprecated. Please use getClusters() instead.');
		//   return getClusters();
		// }
	}
</script>

<svelte:head>
	<title>Rauhankoneen Kerroksia</title>
</svelte:head>

{#if showLang}
	<div class="main-container lang-container">
		<CardLang toggleLang={handleToggleLang} />
	</div>
{/if}

{#if showSubmit}
	<div class="main-container submit-container">
		<CardSubmit toggleLang={handleToggleLang} toExplore={handleToggleExplore} />
	</div>
{/if}

{#if showExplore}
	<div class="main-container explore-container">
		<CardExplore />
	</div>
{/if}

<div class="main-container">
	<CardMain
		toLang={handleToggleLang}
		toSubmit={handleToggleSubmit}
		toExplore={handleToggleExplore}
	/>
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

	.submit-container {
		z-index: 2;
	}

	.explore-container {
		z-index: 3;
	}
</style>
