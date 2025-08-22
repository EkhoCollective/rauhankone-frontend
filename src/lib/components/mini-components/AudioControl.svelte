<script lang="ts">
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { globalAudioStore, globalAudioActions } from '$lib/stores/globalAudioStore';
	import { useAudio } from '$lib/composables/useAudio';

	const { toggleMute } = useAudio();

	async function handleToggleMute() {
		const currentState = $globalAudioStore;
		await toggleMute(!currentState.isGloballyMuted);
	}
</script>

<div class="audio-icon-container">
	<button class="btn" onclick={handleToggleMute}>
		{#if $globalAudioStore.isGloballyMuted}
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
