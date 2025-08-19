<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { page } from '$app/state';
	import { audioStore, audioActions } from '$lib/stores/audioStore';
	import { soundEffects, audioConfig } from '$lib/utils/soundEffects';
	import { audioFader } from '$lib/utils/audioFader';

	// Props for configurable audio settings
	let {
		volume = $bindable(0.3),
		clusterVolume = $bindable(1),
		fadeTime = $bindable(500)
	}: {
		volume?: number;
		clusterVolume?: number;
		fadeTime?: number;
	} = $props();

	let songIdx = $state(0);
	let currentLoadedSong = $state(-1);
	let song = $state<HTMLAudioElement | null>(null);
	let isToggling = false;

	async function togglePlaying() {
		if (isToggling) return;

		try {
			isToggling = true;
			const currentState = $audioStore;
			const newMuted = !currentState.isGloballyMuted;

			// Update the mute state
			audioActions.setMuted(newMuted);

			if (newMuted) {
				// Muting - fade out and stop
				if (song) {
					const duration = isFinite(fadeTime) ? fadeTime : 500;
					await audioFader.fadeOut(song, duration);
					audioActions.setPlayingState('paused');
				}
				soundEffects.stopAllEffects();
			} else {
				// Unmuting - start playing
				await startPlaying();
			}
		} finally {
			isToggling = false;
		}
	}

	async function startPlaying() {
		// If we already have the right song playing, just ensure it's playing
		if (song && currentLoadedSong === songIdx && !song.paused) {
			return;
		}

		// Stop existing song
		if (song) {
			audioFader.cancelFade(song);
			song.pause();
			song = null;
		}

		try {
			// Validate audio parameters from props
			const safeVolume = isFinite(volume) ? volume : 0.3;
			const safeDuration = isFinite(fadeTime) ? fadeTime : 500;

			// Create and play new song
			song = new Audio(tracklist[songIdx].src);
			song.loop = true;
			song.volume = 0;

			await song.play();
			await audioFader.fadeIn(song, safeVolume, safeDuration);

			currentLoadedSong = songIdx;
			audioActions.setCurrentSong(song);
			audioActions.setPlayingState('playing');
			audioActions.setVolume(safeVolume);
		} catch (error) {
			console.error('Failed to start playing song:', error);
			// Reset state on error
			song = null;
			currentLoadedSong = -1;
			audioActions.setPlayingState('paused');
		}
	}

	async function changeSong() {
		if (!song || isToggling) return;

		// Validate audio parameters from props
		const safeVolume = isFinite(volume) ? volume : 0.3;
		const safeDuration = isFinite(fadeTime) ? fadeTime : 500;

		// Fade out current song
		await audioFader.fadeOut(song, safeDuration * 0.5);

		// Load and fade in new song
		song = new Audio(tracklist[songIdx].src);
		song.loop = true;
		song.volume = 0;

		await song.play();
		await audioFader.fadeIn(song, safeVolume, safeDuration * 0.5);

		currentLoadedSong = songIdx;
		audioActions.setCurrentSong(song);
		audioActions.setVolume(safeVolume);
	}

	async function crossFadeToNewSong() {
		if (!song || isToggling) return;

		// Set a temporary flag to prevent other operations
		isToggling = true;

		try {
			const oldSong = song;

			// Validate audio parameters from props
			const safeVolume = isFinite(volume) ? volume : 0.3;
			const safeDuration = isFinite(fadeTime) ? fadeTime : 500;

			// Create new song
			const newSong = new Audio(tracklist[songIdx].src);
			newSong.loop = true;
			newSong.volume = 0;

			// Start new song
			await newSong.play();

			// Cross-fade: fade out old song and fade in new song simultaneously
			const fadeOutPromise = audioFader.fadeOut(oldSong, safeDuration * 0.7);
			const fadeInPromise = audioFader.fadeIn(newSong, safeVolume, safeDuration * 0.7);

			// Wait for both fades to complete
			await Promise.all([fadeOutPromise, fadeInPromise]);

			// Update state
			song = newSong;
			currentLoadedSong = songIdx;
			audioActions.setCurrentSong(newSong);
			audioActions.setVolume(safeVolume);
		} catch (error) {
			console.error('Cross-fade failed:', error);
			// Fallback to regular song change
			await startPlaying();
		} finally {
			isToggling = false;
		}
	}

	// Effect to handle page changes and cross-fade songs
	$effect(() => {
		const newSongIdx = page.url.pathname === '/explore' ? 1 : 0;

		// If the song index is changing and we're currently playing
		if (
			newSongIdx !== songIdx &&
			!$audioStore.isGloballyMuted &&
			$audioStore.playingState === 'playing' &&
			song &&
			!isToggling
		) {
			// Update songIdx first
			const oldSongIdx = songIdx;
			songIdx = newSongIdx;

			// Trigger cross-fade
			crossFadeToNewSong().catch((error) => {
				console.error('Failed to cross-fade to new song:', error);
				// Fallback: just update the index
				songIdx = newSongIdx;
			});
		} else {
			// Just update the index if not playing
			songIdx = newSongIdx;
		}
	});

	// Effect to update cluster volume in sound effects system
	$effect(() => {
		const safeClusterVolume = isFinite(clusterVolume) ? clusterVolume : 1.0;
		audioConfig.setClusterVolume(safeClusterVolume);
	});

	// $inspect('AudioControl state:', {
	// 	songIdx,
	// 	currentLoadedSong,
	// 	isToggling,
	// 	volume,
	// 	fadeTime,
	// 	isGloballyMuted: $audioStore.isGloballyMuted,
	// 	currentPage: page.url.pathname
	// });
</script>

<div class="audio-icon-container">
	<button class="square-button"  onclick={() => togglePlaying()}>
		{#if $audioStore.isGloballyMuted}
			<VolumeX color="#ffffff" />
		{:else}
			<Volume2 color="#ffffff" />
		{/if}
	</button>
</div>

<style>
	.audio-icon-container {
		height: 100%;
		display: flex;
		align-items: center;
	}


</style>
