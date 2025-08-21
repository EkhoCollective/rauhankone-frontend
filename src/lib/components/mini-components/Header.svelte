<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Globe, ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { blur } from 'svelte/transition';
	import AudioControl from '$lib/components/mini-components/AudioControl.svelte';
	import { playBlip } from '$lib/composables/useAudio';

	let { toggleLang, showLang } = $props();

	function playUISound() {
		playBlip();
	}
</script>

<div class="card-header-container">
	{#if page.url.pathname === `${base}/explore`}
		<div transition:blur class="back-btn-container">
			<button
				class="btn"
				onclick={() => {
					playUISound();
					goto(`${base}/`);
				}}><ArrowLeft color="#ffffff" /> {$_('header_btn_exit')}</button
			>
		</div>
	{/if}
	<!-- Lang Button -->
	<div class="lang-btn-container">
		<button
			class="btn"
			onclick={() => {
				playUISound();
				toggleLang();
			}}
			aria-label={$_('aria-lang-toggle')}
		>
			<Globe color="#ffffff" />
		</button>
	</div>
	<!-- Audio Control -->
	<div class="audio-control-container">
		<AudioControl />
	</div>
</div>

<style>
	.back-btn-container {
		grid-column-start: 1;
		grid-row-start: 1;
		justify-self: start;
	}

	.lang-btn-container {
		grid-column-start: 2;
		grid-row-start: 1;
		justify-self: end;
		height: 100%;
	}

	.audio-control-container {
		grid-column-start: 2;
		grid-row-start: 2;
		justify-self: end;
		height: 100%;
	}
	.btn {
		height: 100%;
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
		color: white;
	}
</style>
