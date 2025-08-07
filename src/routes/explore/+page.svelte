<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import { blur } from 'svelte/transition';
	// import AudioComp from '$lib/components/mini-components/AudioControl.svelte';
	import NavIcons from '$lib/components/mini-components/NavIcons.svelte';
	import ModalStory from '$lib/components/mini-components/ModalStory.svelte';
	import Scene from '$lib/components/visual-module/Instance_Nesting.svelte';
	// import CardError from '$lib/components/cards/CardError.svelte';
	import { error } from '@sveltejs/kit';
	import { soundEffects, SOUND_EFFECTS } from '$lib/utils/soundEffects';
	import { MathUtils } from 'three';
	import { Canvas } from '@threlte/core';
	import type { CameraControlsRef } from '@threlte/extras';
	import testData from '$lib/utils/testDataStrings.json';

	let { getOnlyTranslated = $bindable(), triggeredFrom } = $props();

	let response_clusters: any = $state(null);
	let requestLanguage = $state('Any');
	// let raiseError = $state(false);
	let toastEnabled = $state(true);
	let navButtonValue = $state('');
	let selectedStory = $state(null);
	let controls = $state.raw<CameraControlsRef>();

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: handleGetTranslate(), max_stories: 400, story: null }
	};

	async function fetchClusters() {
		await apiRequest(API_CLUSTERS_OPTIONS)
			.then((response) => {
				response_clusters = response;
			})
			.catch((err) => {
				// console.error('Failed to get clusters:', err);
				throw error(500, 'Failed to get clusters');
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

	// Effect to stop sound when modal closes
	$effect(() => {
		if (selectedStory === null) {
			// Modal closed, stop the sound effect
			soundEffects.stopEffect(SOUND_EFFECTS.MODAL_OPEN);
		}
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

	$inspect(response_clusters);
</script>

<!-- Error Card -->
<!-- {#if raiseError}
	<div transition:blur>
		<CardError errorMessage={$_('error_map')} />
	</div>
{/if} -->

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
	<!-- <div class="audio-icon-container">
		<AudioComp songIdx={0} />
	</div> -->
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

	/* .audio-icon-container {
		position: absolute;
		z-index: 100;
		bottom: 20px;
		left: 20px;
	} */

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
