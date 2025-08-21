<script lang="ts">
	import { Square, SquareCheckBig } from 'lucide-svelte';
	import { useAudio } from '$lib/composables/useAudio';

	const { playBlip } = useAudio();

	function playUISound() {
		playBlip();
	}

	let { checkValue = $bindable(false) } = $props();

	function handleCheckmark() {
		checkValue = !checkValue;
	}
</script>

<div class="checkmark-container">
	<button
		class="checkmark-btn"
		onclick={() => {
			playUISound();
			handleCheckmark();
		}}
	>
		{#if checkValue}
			<SquareCheckBig color="#ffffff" />
		{:else}
			<Square color="#ffffff" />
		{/if}
	</button>
</div>
