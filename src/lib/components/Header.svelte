<script lang="ts">
	import { Globe, ArrowLeft } from 'lucide-svelte';
	// export let toLang = () => {};

	let { toggleLang, backToHome, showBackBtn } = $props();
</script>

<div class="header">
	{#if showBackBtn}
		<div class="back-btn-container">
			<button class="btn btn-back" onclick={() => backToHome()}><ArrowLeft /> Back to Home</button>
		</div>
	{/if}
	<div class="lang-btn-container">
		<button class="btn btn-lang" onclick={() => toggleLang()}><Globe /></button>
	</div>
</div>

<style>
	.header {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: end;
	}

	.back-btn-container {
		grid-column: 1;
		justify-self: start;
	}

	.lang-btn-container {
		grid-column: 2;
		justify-self: end;
	}

	.btn-lang {
		border: none;
		box-shadow: none;
	}
</style>
