<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/visual-module/ScenePoints.svelte';
	// import Thankyou from '$lib/components/mini-components/Thankyou.svelte';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';

	let { getOnlyTranslate = $bindable() } = $props();

	let response_clusters = $state(null);
	let requestLanguage = $state('Any');

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: handleGetTranslate(), max_stories: 100, story: null }
	};

	async function fetchClusters() {
		const result = await apiRequest(API_CLUSTERS_OPTIONS);
		if (result) {
			response_clusters = result;
			console.log(response_clusters);
		}
	}

	function handleGetTranslate() {
		if (getOnlyTranslate === true) {
			requestLanguage = getLocaleFullName();
		} else {
			requestLanguage = 'Any';
		}
		return requestLanguage;
	}

	onMount(() => {
		fetchClusters();
	});

	$inspect(response_clusters, getOnlyTranslate);
</script>

<div class="scene-container">
	<!-- {#if showThankyou}
		<Thankyou />
	{/if} -->
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
