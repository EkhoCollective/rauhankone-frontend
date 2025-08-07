<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { page } from '$app/state';
	import { audioStore, audioActions } from '$lib/stores/audioStore';
	import { soundEffects } from '$lib/utils/soundEffects';

	let songIdx = $state(0);
	let currentLoadedSong = $state(-1); // Track which song is currently loaded

	// Use global audio store
	let playingState = $state('paused');
	let song = $state<HTMLAudioElement | null>(null);

	function togglePlaying() {
		// Toggle global mute state instead of just local playing
		audioStore.update((state) => {
			const newMuted = !state.isGloballyMuted;

			// Handle audio playback based on new mute state
			if (newMuted) {
				// Muting - pause the song and stop all sound effects
				if (song) {
					song.pause();
				}
				soundEffects.stopAllEffects();
				playingState = 'paused';
			} else {
				// Unmuting - start playing if not already playing
				if (playingState === 'paused') {
					play();
				}
			}

			return {
				...state,
				isGloballyMuted: newMuted
			};
		});
	}

	function loadSong() {
		// Stop the current song if it exists
		if (song) {
			song.pause();
			song = null;
		}

		song = new Audio(tracklist[songIdx].src);
		song.volume = 0.3;
		song.loop = true;
		song.play();
		currentLoadedSong = songIdx;

		// Update global store
		audioActions.setCurrentSong(song);
		audioActions.setVolume(0.3);
	}

	function play() {
		if (playingState === 'playing') {
			pause();
		}

		playingState = 'playing';
		audioActions.setPlayingState('playing');
		loadSong();
	}

	function pause() {
		playingState = 'paused';
		audioActions.setPlayingState('paused');
		song?.pause();
	}

	// Effect to update songIdx based on URL
	$effect(() => {
		if (page.url.pathname === '/explore') {
			songIdx = 1;
		} else {
			songIdx = 0;
		}
	});

	// Separate effect to handle song loading when songIdx changes
	$effect(() => {
		// Only load song if playing and the song index actually changed
		if (playingState === 'playing' && songIdx !== currentLoadedSong) {
			loadSong();
		}
	});

	// $inspect(page.url.pathname, songIdx, currentLoadedSong);
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
