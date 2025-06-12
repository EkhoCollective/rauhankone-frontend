<script lang="ts">
	import { Square, SquareCheckBig } from 'lucide-svelte';

	let { checkValue = $bindable(false) } = $props();

	function handleCheckmark() {
		checkValue = !checkValue;
	}
</script>

<div class="checkmark-container">
	<button class="checkmark-btn" onclick={() => handleCheckmark()}>
		{#if checkValue}
			<SquareCheckBig />
		{:else}
			<Square />
		{/if}
	</button>
</div>

<style></style>
