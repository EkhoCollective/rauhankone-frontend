<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Globe, ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/state';
	import { base, resolve } from '$app/paths';
	import { blur } from 'svelte/transition';
	import AudioControl from '$lib/components/mini-components/AudioControl.svelte';
	import { playBlip } from '$lib/composables/useAudio';
	import { goto } from '$app/navigation';
	import TopLeftBackBtn from './TopLeftBackBtn.svelte';

	let { toggleLang, showLang } = $props();

	function playUISound() {
		playBlip();
	}
</script>

<header>
	{#if page.url.pathname === `${resolve('/explore')}`}
	<TopLeftBackBtn button_text_id="header_btn_exit" rel_url="/"/>
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
	header {
		
	}



	.audio-control-container {
		grid-column-start: 2;
		grid-row-start: 2;
		justify-self: end;
		height: 100%;
	}

</style>
