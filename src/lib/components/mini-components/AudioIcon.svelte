<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';

	let { audioValue = $bindable(false) } = $props();

	function handleAudioIcon() {
		audioValue = !audioValue;
	}
</script>

<div class="audio-icon-container">
	<button class="audio-icon-btn" onclick={() => handleAudioIcon()}>
		{#if audioValue}
			<Volume2 color="#ffffff" />
		{:else}
			<VolumeX color="#ffffff" />
		{/if}
	</button>
</div>
