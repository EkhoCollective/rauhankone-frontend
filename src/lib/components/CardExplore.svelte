<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import { blur } from 'svelte/transition';
	import AudioIcon from '$lib/components/mini-components/AudioIcon.svelte';
	import CardError from '$lib/components/CardError.svelte';
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/visual-module/ScenePoints.svelte';

	let { getOnlyTranslated = $bindable() } = $props();

	let response_clusters = $state(null);
	let requestLanguage = $state('Any');
	let toggleAudio = $state(false);
	let raiseError = $state(false);

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: handleGetTranslate(), max_stories: 100, story: null }
	};

	async function fetchClusters() {
		await apiRequest(API_CLUSTERS_OPTIONS)
			.then((response) => {
				response_clusters = response;
			})
			.catch((error) => {
				console.log('Error getting clusters', error);
				raiseError = true;
			});
	}

	function handleGetTranslate() {
		if (getOnlyTranslated === true) {
			requestLanguage = getLocaleFullName();
		} else {
			requestLanguage = 'Any';
		}
		return requestLanguage;
	}

	onMount(() => {
		fetchClusters();
	});

	$inspect(response_clusters, getOnlyTranslated, toggleAudio);
</script>

<!-- Error Card -->
{#if raiseError}
	<div transition:blur>
		<CardError errorMessage={$_('error_map')} />
	</div>
{/if}

<div class="scene-container">
	<Canvas>
		<Scene />
	</Canvas>
	<div class="audio-icon-container">
		<AudioIcon bind:audioValue={toggleAudio} />
	</div>
</div>

<style>
	.scene-container {
		width: 100%;
		height: 100vh;
		background-color: black;
	}

	.audio-icon-container {
		position: absolute;
		z-index: 100;
		bottom: 20px;
		left: 20px;
	}
</style>
