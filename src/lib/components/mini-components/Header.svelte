<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Globe, ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/state';
	import { base, resolve } from '$app/paths';
	import { blur } from 'svelte/transition';
	import AudioControl from '$lib/components/mini-components/AudioControl.svelte';
	import { playBlip } from '$lib/composables/useAudio';
	import { goto } from '$app/navigation';

	let { toggleLang, showLang } = $props();

	function playUISound() {
		playBlip();
	}
</script>

<header>
	{#if page.url.pathname === `${resolve('/explore')}`}
	<div class="top-left-buttons">
		<div transition:blur>
			<button
				class="back-button"
				onclick={() => {
					playUISound();
					goto(`${base}/`);
				}}><ArrowLeft color="#ffffff" /> {$_('header_btn_exit')}</button
			>
		</div>
		</div>
	{/if}
<div class="top-right-buttons">
	
	<!-- Lang Button -->
		<button
			class="square-button"
			onclick={() => {
				playUISound();
				toggleLang();
			}}
			aria-label={$_('aria-lang-toggle')}
		>
			<Globe color="#ffffff" />
		</button>
	<!-- Audio Control -->
	<div class="audio-control-container">
		<AudioControl />
	</div>
</div>
</header>

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



	.audio-control-container {
		grid-column-start: 2;
		grid-row-start: 2;
		justify-self: end;
		height: 100%;
	}

</style>
