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
			<SquareCheckBig color="#ffffff" />
		{:else}
			<Square color="#ffffff" />
		{/if}
	</button>
</div>
