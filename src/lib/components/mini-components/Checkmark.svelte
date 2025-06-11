<script lang="ts">
	import { Square, SquareCheckBig } from 'lucide-svelte';

	let checked = $state(false);

	function handleCheckmark() {
		checked = !checked;
	}
</script>

<div class="checkmark-container">
	<button class="checkmark-btn" onclick={() => handleCheckmark()}>
		{#if checked}
			<SquareCheckBig />
		{:else}
			<Square />
		{/if}
	</button>
</div>

<style></style>
