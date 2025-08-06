<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { page } from '$app/state';

	let songIdx = $state(0);

	let playingState = $state('paused');
	let song = $state<HTMLAudioElement | null>(null);

	function togglePlaying() {
		playingState === 'paused' ? play() : pause();
	}

	function loadSong() {
		song = new Audio(tracklist[songIdx].src);
		song.volume = 0.2;
		song.loop = true;
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
		if (page.url.pathname === '/explore') {
			songIdx = 1;
		} else {
			songIdx = 0;
		}
	});
</script>

<div class="audio-icon-container">
	<button class="btn" onclick={() => togglePlaying()}>
		{#if playingState === 'playing'}
			<Volume2 color="#ffffff" />
		{:else}
			<VolumeX color="#ffffff" />
		{/if}
	</button>
</div>

<style>
	.btn {
		height: 100%;
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}
</style>
