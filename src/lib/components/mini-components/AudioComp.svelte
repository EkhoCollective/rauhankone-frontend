<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { tracklist } from '$lib/components/media/audio/tracklist';

	let { songIdx = $bindable() } = $props();

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
</script>

<div class="audio-icon-container">
	<button class="audio-icon-btn" onclick={() => togglePlaying()}>
		{#if playingState === 'playing'}
			<Volume2 color="#ffffff" />
		{:else}
			<VolumeX color="#ffffff" />
		{/if}
	</button>
</div>
