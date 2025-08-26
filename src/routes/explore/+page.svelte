<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import { fade, blur } from 'svelte/transition';
	import CardLoader from '$lib/components/cards/CardLoader.svelte';

	import NavIcons from '$lib/components/mini-components/NavIcons.svelte';
	import ModalStory from '$lib/components/mini-components/ModalStory.svelte';
	import Scene from '$lib/components/visual-module/Map.svelte';
	import StoryInstance from '$lib/components/visual-module/StoryInstance.svelte';
	import { useAudio } from '$lib/composables/useAudio';
	import { MathUtils } from 'three';
	import { Canvas } from '@threlte/core';
	import type { CameraControlsRef } from '@threlte/extras';
	import { getContext } from 'svelte';
	import { customErrorHandler } from '$lib/utils/customErrrorHandler';
	// import { globalAudioStore } from '$lib/stores/globalAudioStore';

	// Get translation setting from context
	let getOnlyTranslated = $state(false);

	const { switchToPage } = useAudio();

	// Get navigation context from layout
	const navigationContext = getContext('navigation') as {
		setSource: (source: 'main' | 'submit') => void;
		setSubmittedStoryId: (storyId: string) => void;
		getNavigationData: () => { source: 'main' | 'submit' | null; storyId: string | null };
		clearNavigation: () => void;
	};

	// Get translation context from layout
	const translationContext = getContext('translation') as {
		translateStories: boolean;
		setTranslateStories: (value: boolean) => void;
	};

	let response_clusters: any = $state(null);
	let currentLocale: string = $state('');
	let requestLanguage: string = $state('');
	let toastEnabled = $state(true);
	let navButtonValue = $state('');

	// Get navigation data once on initialization, and handle it properly
	const initialNavigationData = navigationContext.getNavigationData();
	let navigationData = $state(initialNavigationData);
	let hasHandledAutoModal = $state(false);
	let selectedStory: StoryInstance | any | null = $state(null);
	let selectedStoryLanguageText = $state(null);
	let controls = $state.raw<CameraControlsRef>();
	let currentPlayingSound: string | null = $state(null);
	let navigateToClosestStory: (() => void) | undefined = $state();
	let navigateToFurthestStory: (() => void) | undefined = $state();
	let navigateToStoryProp: ((story: any) => void) | undefined = $state();
	let findStoryInstanceByStoryIdProp: ((storyId: string) => any) | undefined = $state();

	// Camera control values for different devices
	const camRotDesktop = 45;
	const camZoomDesktop = 10;
	const camRotMobile = 20;
	const camZoomMobile = 5;

	const minDimensionalValue: number = 2;
	const maxDimensionalValue: number = 15;

	// Mobile detection state - determined once on mount
	let isMobileDevice = $state(false);

	// Continuous button press state (mobile only)
	let continuousInterval: number | null = $state(null);
	let continuousButtonValue = $state('');
	let isInContinuousPress = $state(false);

	// Mobile detection utility
	function detectMobile(): boolean {
		return (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			window.innerWidth <= 768
		);
	}

	const API_CLUSTERS_OPTIONS = () => ({
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: {
			language: handleGetTranslate(),
			max_stories: 400,
			story: null,
			grid_size: [dimValue(), dimValue(), dimValue()]
		}
	});

	async function fetchClusters() {
		await apiRequest(API_CLUSTERS_OPTIONS())
			.then((response) => {
				response_clusters = response;
				console.log('Fetched clusters:', response_clusters);
				// console.log('Navigation data at fetch time:', navigationData);
				// responsefromDB = true;
			})
			.catch((err) => {
				// console.error('Failed to get clusters:', err);
				customErrorHandler($_('error_description_general'), 500);
			});
	}

	function handleGetTranslate() {
		// Update current locale from svelte-i18n
		currentLocale = $locale || 'en';

		// Determine what to send to API
		if (getOnlyTranslated === true) {
			requestLanguage = 'Any';
		} else {
			requestLanguage = getLocaleFullName();
		}
		return requestLanguage;
	}

	function handleNavButton(buttonValue: string) {
		const rotationValue = isMobileDevice ? camRotMobile : camRotDesktop;
		const zoomValue = isMobileDevice ? camZoomMobile : camZoomDesktop;

		if (buttonValue === 'left') {
			controls?.rotate(-rotationValue * MathUtils.DEG2RAD, 0, true);
			navButtonValue = 'idle';
		} else if (buttonValue === 'right') {
			controls?.rotate(rotationValue * MathUtils.DEG2RAD, 0, true);
			navButtonValue = 'idle';
		} else if (buttonValue === 'plus') {
			controls?.dolly(zoomValue, true);
			navButtonValue = 'idle';
		} else if (buttonValue === 'minus') {
			controls?.dolly(-zoomValue, true);
			navButtonValue = 'idle';
		}
	}

	function dimValue() {
		return (
			Math.floor(Math.random() * (maxDimensionalValue - minDimensionalValue + 1)) +
			minDimensionalValue
		);
	}

	// Continuous button press functions (all devices)
	function startContinuousPress(buttonValue: string) {
		// Clear any existing interval
		stopContinuousPress();

		// Set the current button value and flag
		continuousButtonValue = buttonValue;
		isInContinuousPress = true;

		// Execute the action immediately
		handleNavButton(buttonValue);

		// Start the continuous interval (repeat every 100ms)
		continuousInterval = setInterval(() => {
			handleNavButton(continuousButtonValue);
		}, 100);
	}

	function stopContinuousPress() {
		if (continuousInterval) {
			clearInterval(continuousInterval);
			continuousInterval = null;
		}
		continuousButtonValue = '';
		isInContinuousPress = false;
	}

	$effect(() => {
		handleNavButton(navButtonValue);
	});

	// Effect to stop sound when modal closes or track sound when modal opens
	$effect(() => {
		if (selectedStory === null) {
			// Modal closed, stop the current playing sound
			if (currentPlayingSound) {
				// TODO: Implement cluster sound stopping with new audio system
				// soundEffects.stopEffect(currentPlayingSound);
				currentPlayingSound = null;
			}
		} else {
			// Modal opened, track the current sound (but don't auto-play)
			currentPlayingSound = selectedStory.cluster_audio_id;
		}
	});

	$effect(() => {
		if (selectedStory !== null) {
			const currentLanguage = getLocaleFullName();

			// Handle different story structures - selectedStory might be a StoryInstance or raw story data
			if (selectedStory.story && Array.isArray(selectedStory.story)) {
				// StoryInstance - story is an array
				// Loop through stories to find the first one that matches the current language
				const matchingStory = selectedStory.story.find(
					(story: any) => story?.language === currentLanguage
				);
				selectedStoryLanguageText = matchingStory?.text || null;
			} else if (Array.isArray(selectedStory)) {
				// Raw story data - selectedStory itself is an array
				// Loop through stories to find the first one that matches the current language
				const matchingStory = selectedStory.find(
					(story: any) => story?.language === currentLanguage
				);
				selectedStoryLanguageText = matchingStory?.text || null;
			} else {
				// Fallback - might be a single story object
				// Check if the single story matches the current language
				if (selectedStory.language === currentLanguage) {
					selectedStoryLanguageText = selectedStory.text || null;
				} else {
					selectedStoryLanguageText = null;
				}
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

	// Function to handle automatic modal opening based on navigation context
	function handleAutoModal() {
		if (!navigationData.source || hasHandledAutoModal) return;

		// console.log('handleAutoModal triggered:', navigationData);

		if (navigationData.source === 'submit' && navigationData.storyId) {
			// Find the corresponding StoryInstance from the Map component
			if (findStoryInstanceByStoryIdProp) {
				const storyInstance = findStoryInstanceByStoryIdProp(navigationData.storyId);
				// console.log('Found story instance:', storyInstance);
				if (storyInstance) {
					// Set the StoryInstance as selected (this will open the modal)
					selectedStory = storyInstance;

					// Also navigate to the story using the Map component's navigation
					// We need to wait for the Map component to be ready
					setTimeout(() => {
						if (navigateToStoryProp) {
							navigateToStoryProp(storyInstance);
						}
					}, 100);
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
		// Set audio context for explore page
		switchToPage('explore');

		// Get translation setting from context

		// Detect mobile device once on mount
		isMobileDevice = detectMobile();

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

		// Cleanup function to clear intervals when component unmounts
		return () => {
			stopContinuousPress();
		};
	});

	// Watch for response_clusters to be loaded, then handle auto modal
	$effect(() => {
		if (response_clusters && navigationData.source && !hasHandledAutoModal) {
			// Use setTimeout to avoid reactive state conflicts and ensure Map is rendered
			setTimeout(() => {
				handleAutoModal();
			}, 500); // Increased timeout to ensure Map is fully rendered
		}
	});

	// Track previous locale to avoid constant refetching
	let previousLocale = $state($locale || 'en');

	// Watch for locale changes and refetch clusters
	$effect(() => {
		const newLocale = $locale || 'en';

		// Only refetch if locale actually changed
		if (newLocale !== previousLocale) {
			// console.log('Language changed to:', newLocale);
			// console.log('New language full name:', getLocaleFullName());

			// Refetch clusters when language changes
			if (response_clusters !== null) {
				// console.log('Refetching clusters due to language change...');
				response_clusters = null;
				// console.log('getLocaleFullName', getLocaleFullName());
				fetchClusters();
			}

			// Update previous locale
			previousLocale = newLocale;
		}
	});

	$effect(() => {
		getOnlyTranslated = translationContext.translateStories;
	});

	// $inspect(selectedStory);
</script>

<svelte:head>
	<title>{$_('main_title')} | {$_('main_subtitle')} | Oulu 2026</title>
</svelte:head>

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
				bind:isTranslated={getOnlyTranslated}
				bind:currentLocale
				bind:selectedStory
				bind:navigateToClosestStory
				bind:navigateToFurthestStory
				bind:navigateToStoryProp
				bind:findStoryInstanceByStoryIdProp
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
			<NavIcons
				bind:value={navButtonValue}
				{isMobileDevice}
				{isInContinuousPress}
				onTouchStart={startContinuousPress}
				onTouchEnd={stopContinuousPress}
			/>
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
