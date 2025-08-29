<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { globalAudioStore, globalAudioActions } from '$lib/stores/globalAudioStore';
	import { useAudio } from '$lib/composables/useAudio';

	const { toggleMute } = useAudio();

	async function handleToggleMute() {
		const currentState = $globalAudioStore;
		await toggleMute(!currentState.isGloballyMuted);
	}
</script>

	<button
		class="square-button"
		onclick={handleToggleMute}
		aria-pressed={$globalAudioStore.isGloballyMuted}
		aria-label={$globalAudioStore.isGloballyMuted ? $_('audio_label_unmute') : $_('audio_label_mute')}
	>
		{#if $globalAudioStore.isGloballyMuted}
			<VolumeX color="#ffffff" />
		{:else}
			<Volume2 color="#ffffff" />
		{/if}
	</button>

<style>
</style>
