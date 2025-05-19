<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/visual-module/Scene.svelte';

	import { getAuthToken } from '$lib/utils/api_token';
	import { apiRequest } from '$lib/utils/api_request';

	let response_clusters = {
		id: '',
		created_at: 0,
		clusters: []
	};

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: 'Any', max_stories: 100, story: null }
	};

	async function fetchClusters() {
		const result = await apiRequest(API_CLUSTERS_OPTIONS);
		if (result) {
			response_clusters = result;
		}
	}

	// Fetch clusters when component mounts
	fetchClusters();
</script>

<div class="scene-container">
	<Canvas>
		<Scene data={response_clusters} />
	</Canvas>
</div>

<style>
	.scene-container {
		width: 100%;
		height: 100vh;
		background-color: black;
	}
</style>
