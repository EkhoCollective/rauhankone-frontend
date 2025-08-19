<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Globe, ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { blur } from 'svelte/transition';
	import AudioControl from '$lib/components/mini-components/AudioControl.svelte';

	let { toggleLang, showLang } = $props();
	let audioVolume = $state(0.5);
	let audioClusterVolume = $state(1);
	let audioFadeTime = $state(500);
</script>

<div class="card-header-container">
	{#if page.url.pathname === `${resolve('/explore')}`}
		<div transition:blur class="back-btn-container">
			<button class="btn" onclick={() => resolve('/explore')}>
				<ArrowLeft color="#ffffff" /> {$_('header_btn_exit')}
			</button>
		</div>
	{/if}

	<!-- Lang Button -->
	<div class="lang-btn-container">
		<button class="square-icon-button"
		onclick={() => toggleLang()}
		aria-label={$_('aria-lang-toggle')}
		>
		<Globe color="#ffffff" />
		</button>
	</div> 
	<!-- Audio Control -->
	<div class="audio-control-container">
		<AudioControl
			bind:volume={audioVolume}
			bind:fadeTime={audioFadeTime}
			bind:clusterVolume={audioClusterVolume}
		/>
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

</style>
