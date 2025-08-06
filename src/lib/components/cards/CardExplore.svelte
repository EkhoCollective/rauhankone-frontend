<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import { blur } from 'svelte/transition';
	import AudioIcon from '$lib/components/mini-components/AudioIcon.svelte';
	import NavIcons from '$lib/components/mini-components/NavIcons.svelte';
	import ModalStory from '$lib/components/mini-components/ModalStory.svelte';
	import Scene from '$lib/components/visual-module/Instance_Nesting.svelte';
	import CardError from '$lib/components/cards/CardError.svelte';
	import { MathUtils } from 'three';
	import { Canvas } from '@threlte/core';
	import type { CameraControlsRef } from '@threlte/extras';
	import testData from '$lib/utils/testDataStrings.json';
	import { tracklist } from '$lib/components/media/audio/tracklist';

	let { getOnlyTranslated = $bindable(), triggeredFrom } = $props();

	let response_clusters: any = $state(null);
	let response_stories: any = $state(null);
	let requestLanguage = $state('Any');
	let audioState = $state(false);
	let raiseError = $state(false);
	let toastEnabled = $state(true);
	let navButtonValue = $state('');
	let selectedStory = $state(null);
	let controls = $state.raw<CameraControlsRef>();

	let playingState = $state('paused');
	let song = $state<HTMLAudioElement | null>(null);

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: handleGetTranslate(), max_stories: 400, story: null }
	};

	async function fetchClusters() {
		await apiRequest(API_CLUSTERS_OPTIONS)
			.then((response) => {
				response_clusters = response;
				// console.log('response_clusters', response_clusters);
			})
			.catch((error) => {
				// console.log('Error getting clusters', error);
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

	function togglePlaying() {
		playingState === 'paused' ? play() : pause();
	}

	function loadSong() {
		song = new Audio(tracklist[0].src);
		song.volume = 0.2;
		song.play();
	}

	function play() {
		if (playingState === 'playing') {
			pause();
		}

		playingState = 'playing';
		loadSong();
	}

	function pause() {
		playingState = 'paused';
		song?.pause();
	}

	$effect(() => {
		handleNavButton(navButtonValue);
	});

	onMount(() => {
		fetchClusters();

		// Set timeout to hide toast after 3 seconds
		if (triggeredFrom) {
			setTimeout(() => {
				toastEnabled = false;
			}, 3000);
		}
	});

	// $inspect(response_clusters, getOnlyTranslated, toggleAudio, triggeredFrom, toastEnabled);
	// $inspect(selectedStory);
	// $inspect('response_clusters', response_clusters);
	$inspect(playingState);
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
	<div>
		{#if selectedStory}<div
				class="modal-story-container"
				in:blur={{ duration: 500 }}
				out:blur={{ duration: 500 }}
			>
				<ModalStory story={selectedStory} closeModal={() => (selectedStory = null)} />
			</div>
		{/if}
	</div>
	<Canvas>
		<Scene bind:controls data={testData} bind:selectedStory />
	</Canvas>
	<div class="audio-icon-container">
		<AudioIcon handleAudio={togglePlaying} audioValue={audioState} />
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

	.modal-story-container {
		backdrop-filter: blur(10px);
		position: absolute;
		z-index: 100;
		top: 0;
		left: 0;
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
