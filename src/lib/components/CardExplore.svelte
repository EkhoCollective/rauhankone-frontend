<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { apiRequestGET } from '$lib/utils/api_request_GET';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import { blur } from 'svelte/transition';
	import AudioIcon from '$lib/components/mini-components/AudioIcon.svelte';
	import NavIcons from '$lib/components/mini-components/NavIcons.svelte';
	import CardError from '$lib/components/CardError.svelte';
	import { Canvas } from '@threlte/core';
	import type { CameraControlsRef } from '@threlte/extras';
	import Scene from '$lib/components/visual-module/Scene_basic_hover.svelte';
	import { MathUtils } from 'three';

	let { getOnlyTranslated = $bindable(), triggeredFrom } = $props();

	let response_clusters: any = $state(null);
	let response_stories: any = $state(null);
	let requestLanguage = $state('Any');
	let toggleAudio = $state(false);
	let raiseError = $state(false);
	let toastEnabled = $state(true);
	let navButtonValue = $state('');

	let controls = $state.raw<CameraControlsRef>();

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: handleGetTranslate(), max_stories: 400, story: null }
	};

	const API_STORIES_OPTIONS = {
		API_ENDPOINT: '/get_stories',
		API_METHOD: 'GET',
		REQUEST_PARAMS: { language: 'Any', max_stories: 1000 }
	};

	async function fetchClusters() {
		await apiRequest(API_CLUSTERS_OPTIONS)
			.then((response) => {
				response_clusters = response;
				console.log('response_clusters', response_clusters);
			})
			.catch((error) => {
				console.log('Error getting clusters', error);
				raiseError = true;
			});
	}

	async function fetchStories() {
		await apiRequestGET(API_STORIES_OPTIONS)
			.then((response) => {
				response_stories = response;
				console.log('response_stories', response_stories);
			})
			.catch((error) => {
				console.log('Error getting stories', error);
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

	function handleNavButton(buttonValue: string) {
		if (buttonValue === 'left') {
			controls?.rotate(-45 * MathUtils.DEG2RAD, 0, true);
			navButtonValue = 'idle';
		} else if (buttonValue === 'right') {
			controls?.rotate(45 * MathUtils.DEG2RAD, 0, true);
			navButtonValue = 'idle';
		} else if (buttonValue === 'plus') {
			controls?.dolly(10, true);
			navButtonValue = 'idle';
		} else if (buttonValue === 'minus') {
			controls?.dolly(-10, true);
			navButtonValue = 'idle';
		}
	}

	$effect(() => {
		handleNavButton(navButtonValue);
	});

	onMount(() => {
		fetchClusters();
		fetchStories();

		// Set timeout to hide toast after 3 seconds
		if (triggeredFrom) {
			setTimeout(() => {
				toastEnabled = false;
			}, 3000);
		}
	});

	// $inspect(response_clusters, getOnlyTranslated, toggleAudio, triggeredFrom, toastEnabled);
	// $inspect(navButtonValue);
</script>

<!-- Error Card -->
{#if raiseError}
	<div transition:blur>
		<CardError errorMessage={$_('error_map')} />
	</div>
{/if}

{#if triggeredFrom === 'submit' && toastEnabled}
	<div transition:blur class="toast-container">
		<p>{$_('toast_from_submit')}</p>
	</div>
{/if}

{#if triggeredFrom === 'main' && toastEnabled}
	<div transition:blur class="toast-container">
		<p>{$_('toast_from_home')}</p>
	</div>
{/if}

<div class="scene-container">
	<Canvas>
		<Scene bind:controls />
	</Canvas>
	<div class="audio-icon-container">
		<AudioIcon bind:audioValue={toggleAudio} />
	</div>
	<div class="navigation-icons-container">
		<NavIcons bind:value={navButtonValue} />
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

	.navigation-icons-container {
		position: absolute;
		z-index: 200;
		bottom: 20px;
		right: 20px;
	}

	.toast-container {
		position: absolute;
		z-index: 100;
		top: 100px;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
