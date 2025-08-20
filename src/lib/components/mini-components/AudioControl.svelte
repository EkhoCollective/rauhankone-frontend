<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { page } from '$app/state';
	import { audioStore, audioActions } from '$lib/stores/audioStore';
	import { soundEffects } from '$lib/utils/soundEffects';
	import { audioFader } from '$lib/utils/audioFader';
	import { mobileAudioHandler, isMobileDevice } from '$lib/utils/mobileAudioHandler';

	// Props for configurable audio settings
	let {
		volume = $bindable(0.3),
		fadeTime = $bindable(500)
	}: {
		volume?: number;
		fadeTime?: number;
	} = $props();

	let songIdx = $state(0);
	let currentLoadedSong = $state(-1);
	let song = $state<HTMLAudioElement | null>(null);
	let isToggling = false;
	let isMobile = $state(false);

	// Initialize mobile detection
	$effect(() => {
		if (typeof window !== 'undefined') {
			isMobile = isMobileDevice();
		}
	});

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
					const optimizedDuration = mobileAudioHandler.getOptimizedFadeDuration(duration, true);
					await audioFader.fadeOut(song, optimizedDuration);
					audioActions.setPlayingState('paused');
				}
				soundEffects.stopAllEffects();
			} else {
				// Unmuting - enable audio context first on mobile
				if (isMobile && !mobileAudioHandler.isAudioContextReady()) {
					const enabled = await mobileAudioHandler.enableAudio();
					if (!enabled) {
						console.warn('Audio context could not be enabled');
						// Reset mute state if audio couldn't be enabled
						audioActions.setMuted(true);
						return;
					}
				}

				// Start playing
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

		try {
			// Validate audio parameters from props
			const safeVolume = isFinite(volume) ? volume : 0.3;
			const baseDuration = isFinite(fadeTime) ? fadeTime : 500;
			const optimizedDuration = mobileAudioHandler.getOptimizedFadeDuration(baseDuration);

			// Mobile optimization: Reuse existing audio element when possible
			if (song && currentLoadedSong !== songIdx) {
				// Stop current audio and change source
				audioFader.cancelFade(song);
				song.pause();
				song.src = tracklist[songIdx].src;
				song.load(); // Important: reload the audio with new source
			} else if (!song) {
				// Create new audio element only if none exists
				song = new Audio(tracklist[songIdx].src);
				song.loop = true;
				mobileAudioHandler.prepareAudioElement(song);
			}

			song.volume = 0;
			await song.play();
			await audioFader.fadeIn(song, safeVolume, optimizedDuration);

			currentLoadedSong = songIdx;
			audioActions.setCurrentSong(song);
			audioActions.setPlayingState('playing');
			audioActions.setVolume(safeVolume);
		} catch (error) {
			console.error('Failed to start playing song:', error);
			// Reset state on error
			if (song) {
				song.pause();
				song.currentTime = 0;
			}
			audioActions.setPlayingState('paused');
		}
	}

	async function changeSong() {
		if (!song || isToggling) return;

		// Validate audio parameters from props
		const safeVolume = isFinite(volume) ? volume : 0.3;
		const baseDuration = isFinite(fadeTime) ? fadeTime : 500;
		const fadeOutDuration = mobileAudioHandler.getOptimizedFadeDuration(baseDuration * 0.5, true);
		const fadeInDuration = mobileAudioHandler.getOptimizedFadeDuration(baseDuration * 0.5);

		// Fade out current song
		await audioFader.fadeOut(song, fadeOutDuration);

		// Reuse audio element: change source and reload (mobile-friendly)
		song.src = tracklist[songIdx].src;
		song.load();
		song.volume = 0;

		await song.play();
		await audioFader.fadeIn(song, safeVolume, fadeInDuration);

		currentLoadedSong = songIdx;
		audioActions.setCurrentSong(song);
		audioActions.setVolume(safeVolume);
	}

	async function crossFadeToNewSong() {
		if (!song || isToggling) return;

		// Set a temporary flag to prevent other operations
		isToggling = true;

		try {
			// Validate audio parameters from props
			const safeVolume = isFinite(volume) ? volume : 0.3;
			const baseDuration = isFinite(fadeTime) ? fadeTime : 500;
			const optimizedDuration = mobileAudioHandler.getOptimizedFadeDuration(baseDuration * 0.7);

			if (isMobile || !mobileAudioHandler.supportsMultipleAudioStreams()) {
				// Mobile/Limited: Use sequential fade instead of concurrent audio
				// This avoids audio context and loading issues on mobile
				await audioFader.fadeOut(song, optimizedDuration);

				// Reuse the same audio element
				song.src = tracklist[songIdx].src;
				song.load();
				song.volume = 0;

				await song.play();
				await audioFader.fadeIn(song, safeVolume, optimizedDuration);
			} else {
				// Desktop: True cross-fade (concurrent audio)
				const oldSong = song;

				// Create new song
				const newSong = new Audio(tracklist[songIdx].src);
				newSong.loop = true;
				newSong.volume = 0;
				mobileAudioHandler.prepareAudioElement(newSong);

				// Start new song
				await newSong.play();

				// Cross-fade: fade out old song and fade in new song simultaneously
				const fadeOutPromise = audioFader.fadeOut(oldSong, optimizedDuration);
				const fadeInPromise = audioFader.fadeIn(newSong, safeVolume, optimizedDuration);

				// Wait for both fades to complete
				await Promise.all([fadeOutPromise, fadeInPromise]);

				// Update song reference
				song = newSong;
			}

			// Update state
			currentLoadedSong = songIdx;
			audioActions.setCurrentSong(song);
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
	<button class="btn" onclick={() => togglePlaying()}>
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

	.btn {
		height: 100%;
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}
</style>
