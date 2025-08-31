<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { ArrowLeft } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import { blur } from 'svelte/transition';
	import { playBlip } from '$lib/composables/useAudio';
	import { goto } from '$app/navigation';

    let { button_text_id, rel_url } = $props();

	function playUISound() {
		playBlip();
	}
</script>

	<div class="top-left-buttons">
		<div transition:blur>
			<button
				class="back-button"
				onclick={() => {
					playUISound();
					goto(resolve(rel_url));
				}}><ArrowLeft color="#ffffff" /> {$_(button_text_id)}</button
			>
		</div>
		</div>


<style>
	.back-button {
		width: 100%;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		gap: 0.5rem;
		min-height: 40px;
		margin: var(--base-margin);
		justify-content: center;
		align-items: center;
	}




</style>
