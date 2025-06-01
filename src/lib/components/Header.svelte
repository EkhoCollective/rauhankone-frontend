<script lang="ts">
	import { Globe } from 'lucide-svelte';
	// export let toLang = () => {};

	let { openLangCard } = $props();
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" onclick={() => openLangCard()}><Globe /></button>
		</div>
	</div>
</div>

<style>
	.card-header-container {
		display: grid;
		justify-items: end;
	}

	.btn-lang {
		border: none;
		box-shadow: none;
	}
</style>
