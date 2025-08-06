<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Globe, ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { blur } from 'svelte/transition';

	let { toggleLang } = $props();
</script>

<div class="card-header-container">
	{#if page.url.pathname === '/explore'}
		<div transition:blur class="back-btn-container">
			<button class="btn" onclick={() => goto('/')}
				><ArrowLeft color="#ffffff" /> {$_('btn_exit')}</button
			>
		</div>
	{/if}
	<div class="lang-btn-container">
		<button class="btn" onclick={() => toggleLang()}><Globe color="#ffffff" /></button>
	</div>
</div>

<style>
	.card-header-container {
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: end;
		background-color: transparent;
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
