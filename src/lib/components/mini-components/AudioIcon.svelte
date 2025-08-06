<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';

	let { handleAudio, audioValue } = $props();

	function handleAudioIcon() {
		audioValue = !audioValue;
	}
</script>

<div class="audio-icon-container">
	<button class="audio-icon-btn" onclick={() => (handleAudio(), handleAudioIcon())}>
		{#if audioValue}
			<Volume2 color="#ffffff" />
		{:else}
			<VolumeX color="#ffffff" />
		{/if}
	</button>
</div>
