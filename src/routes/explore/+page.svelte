<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import { fade, blur } from 'svelte/transition';
	import CardLoader from '$lib/components/cards/CardLoader.svelte';

	import NavIcons from '$lib/components/mini-components/NavIcons.svelte';
	import ModalStory from '$lib/components/mini-components/ModalStory.svelte';
	import Scene from '$lib/components/visual-module/Map.svelte';
	import StoryInstance from '$lib/components/visual-module/StoryInstance.svelte';
	// import CardError from '$lib/components/cards/CardError.svelte';
	import { error } from '@sveltejs/kit';
	import { soundEffects } from '$lib/utils/soundEffects';
	import { MathUtils } from 'three';
	import { Canvas } from '@threlte/core';
	import type { CameraControlsRef } from '@threlte/extras';
	import { getContext } from 'svelte';
	import { audioStore } from '$lib/stores/audioStore';

	let { getOnlyTranslated = $bindable() } = $props();

	// Get navigation context from layout
	const navigationContext = getContext('navigation') as {
		setSource: (source: 'main' | 'submit') => void;
		setSubmittedStoryId: (storyId: string) => void;
		getNavigationData: () => { source: 'main' | 'submit' | null; storyId: string | null };
		clearNavigation: () => void;
	};

	let response_clusters: any = $state(null);
	// let responsefromDB = $state(false);
	let requestLanguage = $state('Any');
	// let raiseError = $state(false);
	let toastEnabled = $state(true);
	let navButtonValue = $state('');
	// Get navigation data once on initialization, and handle it properly
	const initialNavigationData = navigationContext.getNavigationData();
	console.log('Initial navigation data on explore page:', initialNavigationData);
	let navigationData = $state(initialNavigationData);
	let hasHandledAutoModal = $state(false);
	let selectedStory: StoryInstance | any | null = $state(null);
	let selectedStoryLanguageText = $state(null);
	let controls = $state.raw<CameraControlsRef>();
	let currentPlayingSound: string | null = $state(null);
	let navigateToClosestStory: (() => void) | undefined = $state();
	let navigateToFurthestStory: (() => void) | undefined = $state();

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: handleGetTranslate(), max_stories: 400, story: null }
	};

	async function fetchClusters() {
		await apiRequest(API_CLUSTERS_OPTIONS)
			.then((response) => {
				response_clusters = response;
				console.log('Fetched clusters:', response_clusters);
				// console.log('Navigation data at fetch time:', navigationData);
				// responsefromDB = true;
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

	// Effect to stop sound when modal closes or track sound when modal opens
	$effect(() => {
		if (selectedStory === null) {
			// Modal closed, stop the current playing sound
			if (currentPlayingSound) {
				soundEffects.stopEffect(currentPlayingSound);
				currentPlayingSound = null;
			}
		} else {
			// Modal opened, track the current sound (but don't auto-play)
			currentPlayingSound = selectedStory.cluster_audio_id;
		}
	});

	$effect(() => {
		if (selectedStory !== null) {
			// Handle different story structures - selectedStory might be a StoryInstance or raw story data
			if (selectedStory.story && Array.isArray(selectedStory.story)) {
				// StoryInstance - story is an array
				selectedStoryLanguageText = selectedStory.story[0]?.text;
			} else if (Array.isArray(selectedStory)) {
				// Raw story data - selectedStory itself is an array
				selectedStoryLanguageText = selectedStory[0]?.text;
			} else {
				// Fallback - might be a single story object
				selectedStoryLanguageText = selectedStory.text || null;
			}
		}
	});

	// Handle navigation to closest story
	function handleNavigateClosest() {
		if (navigateToClosestStory) {
			navigateToClosestStory();
		}
	}

	// Handle navigation to furthest story
	function handleNavigateFurthest() {
		if (navigateToFurthestStory) {
			navigateToFurthestStory();
		}
	}

	// Function to find story by ID in clusters and return the actual StoryInstance from Map
	function findStoryInstanceById(storyId: string) {
		if (!response_clusters?.clusters) return null;

		// First, find the story data in the API response
		for (const cluster of response_clusters.clusters) {
			for (const story of cluster.stories) {
				// Story contains multiple arrays (different language versions)
				// Check each element in the story array for the matching id
				for (const storyElement of story) {
					if (storyElement?.id === storyId) {
						console.log('Found story:', storyElement);

						// Found the story! Return the entire story array with cluster info
						return {
							story: story,
							cluster_audio_id: cluster.text,
							cluster_id: cluster.text,
							text: story[0]?.text
						};
					}
				}
			}
		}
		return null;
	}

	// Function to select random story from clusters and return as StoryInstance
	function selectRandomStory() {
		if (!response_clusters?.clusters) return null;

		const allStories = response_clusters.clusters.flatMap((cluster: any) =>
			cluster.stories.map((story: any) => ({ story, cluster }))
		);
		if (allStories.length === 0) return null;

		const randomIndex = Math.floor(Math.random() * allStories.length);
		const randomStoryWithCluster = allStories[randomIndex];

		// Return the story in a format compatible with selectedStory
		return {
			story: randomStoryWithCluster.story,
			cluster_audio_id: randomStoryWithCluster.cluster.text,
			cluster_id: randomStoryWithCluster.cluster.text,
			text: randomStoryWithCluster.story[0]?.text
		};
	}

	// Function to handle automatic modal opening based on navigation context
	function handleAutoModal() {
		if (!navigationData.source || hasHandledAutoModal) return;

		console.log('handleAutoModal triggered:', navigationData);

		if (navigationData.source === 'submit' && navigationData.storyId) {
			// Find and select the submitted story
			const submittedStory = findStoryInstanceById(navigationData.storyId);
			// console.log('Found submitted story:', submittedStory);
			if (submittedStory) {
				selectedStory = submittedStory;
				// Only play sound if audio is explicitly enabled AND playing
				// This prevents AudioContext creation without user gesture
				const audioState = $audioStore;
				if (!audioState.isGloballyMuted && audioState.playingState === 'playing') {
					soundEffects.playEffect(submittedStory.cluster_audio_id);
				}
			} else {
				// console.log('Submitted story not found in clusters, opening map normally');
			}
		} else if (navigationData.source === 'main') {
			// Select a random story
			const randomStory = selectRandomStory();
			// console.log('Selected random story:', randomStory);
			if (randomStory) {
				selectedStory = randomStory;
				// Only play sound if audio is explicitly enabled AND playing
				// This prevents AudioContext creation without user gesture
				const audioState = $audioStore;
				if (!audioState.isGloballyMuted && audioState.playingState === 'playing') {
					soundEffects.playEffect(randomStory.cluster_audio_id);
				}
			}
		}

		// Mark as handled and clear navigation context
		hasHandledAutoModal = true;
		navigationContext.clearNavigation();
		// Clear navigation data to prevent re-triggering
		navigationData = { source: null, storyId: null };
	}

	onMount(() => {
		// Add 5 second delay before fetching clusters to account for DB delay
		setTimeout(() => {
			fetchClusters();
		}, 1000);

		// Set timeout to hide toast after 3 seconds
		if (navigationData.source) {
			setTimeout(() => {
				toastEnabled = false;
			}, 3000);
		}
	});

	// Watch for response_clusters to be loaded, then handle auto modal
	$effect(() => {
		if (response_clusters && navigationData.source && !hasHandledAutoModal) {
			// console.log('Clusters loaded, checking for auto modal...');
			// Use setTimeout to avoid reactive state conflicts and ensure Map is rendered
			setTimeout(() => {
				handleAutoModal();
			}, 500); // Increased timeout to ensure Map is fully rendered
		}
	});

	// $inspect(selectedStory);
	// $inspect(response_clusters);
</script>

<svelte:head>
	<title>{$_('main_title')} | {$_('main_subtitle')} | Oulu 2026</title>
</svelte:head>

<!-- Error Card -->
<!-- {#if raiseError}
	<div transition:blur>
		<CardError errorMessage={$_('error_map')} />
	</div>
{/if} -->

{#if navigationData.source === 'submit' && toastEnabled}
	<div transition:blur class="toast-container">
		<p>{$_('explore_toast_from_submit')}</p>
	</div>
{/if}

{#if navigationData.source === 'main' && toastEnabled}
	<div transition:blur class="toast-container">
		<p>{$_('explore_toast_from_home')}</p>
	</div>
{/if}

<div class="scene-container">
	<div>
		{#if selectedStory}<div
				class="modal-story-container"
				in:blur={{ duration: 500 }}
				out:blur={{ duration: 500 }}
			>
				<ModalStory
					story={selectedStoryLanguageText}
					closeModal={() => (selectedStory = null)}
					onNavigateClosest={handleNavigateClosest}
					onNavigateFurthest={handleNavigateFurthest}
				/>
			</div>
		{/if}
	</div>
	{#if response_clusters !== null}
		<Canvas>
			<Scene
				bind:controls
				data={response_clusters}
				bind:selectedStory
				bind:navigateToClosestStory
				bind:navigateToFurthestStory
			/>
		</Canvas>
	{:else}
		<div class="loader-container" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
			<CardLoader />
		</div>
	{/if}
	{#if selectedStory === null}
		<div
			class="navigation-icons-container"
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NavIcons bind:value={navButtonValue} />
		</div>
	{/if}
</div>

<style>
	.scene-container {
		width: 100%;
		height: 100vh;
		background-color: black;
	}

	.modal-story-container {
		backdrop-filter: blur(10px);
		background-color: rgba(0, 0, 0, 0.7);
		position: absolute;
		z-index: 100;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
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
