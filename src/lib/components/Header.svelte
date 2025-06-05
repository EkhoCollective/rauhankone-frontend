<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Globe, ArrowLeft } from 'lucide-svelte';

	let { toggleLang, backToHome, showBackBtn } = $props();
</script>

<div class="header">
	{#if showBackBtn}
		<div class="back-btn-container">
			<button class="btn" onclick={() => backToHome()}><ArrowLeft /> {$_('btn_exit')}</button>
		</div>
	{/if}
	<div class="lang-btn-container">
		<button class="btn" onclick={() => toggleLang()}><Globe /></button>
	</div>
</div>

<style>
	.header {
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: end;
	}

	.back-btn-container {
		grid-column-start: 1;
		justify-self: start;
	}

	.lang-btn-container {
		grid-column-start: 2;
		justify-self: end;
		height: 100%;
	}
	.btn {
		height: 100%;
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}
</style>
