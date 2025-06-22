<script lang="ts">
	import { _, locale, waitLocale } from 'svelte-i18n';
	import { X } from 'lucide-svelte';
	import Checkmark from '$lib/components/mini-components/Checkmark.svelte';
	import { onMount } from 'svelte';

	let { closeLangCard, translate = $bindable() } = $props();

	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'fi', name: 'Suomi' },
		{ code: 'sv', name: 'Svenska' },
		{ code: 'sa', name: 'Sámegiella' }
	];

	async function handleLocaleChange(lang_code: string) {
		locale.set(lang_code);
		localStorage.setItem('locale', lang_code);
		await waitLocale().then(() => {
			console.log('Locale loaded');
			closeLangCard(false);
		});
	}

	onMount(() => {
		// window.scrollTo(0, 0);
	});
</script>

<div class="card-lang-container">
	<!-- Header/Language Selector -->
	<div class="card-header-container">
		<button class="btn btn-close" onclick={() => closeLangCard()}><X /></button>
	</div>
	<!-- Buttons Container -->
	<div class="card-btn-container">
		{#each languages as { code, name }}
			<button
				class="btn btn-lang"
				class:active-lang={$locale === code}
				onclick={() => handleLocaleChange(code)}>{name}</button
			>
		{/each}
	</div>
	<!-- Extra Selector -->
	<div class="card-extra-container">
		<div class="card-checkmark-container">
			<Checkmark bind:checkValue={translate} />
		</div>
		<div>{$_('btn_translate_check')}</div>
	</div>
</div>

<style>
	.card-lang-container {
		width: 100%;
		height: 100%;
		background-color: black;
		display: grid;
		grid-template-rows: 50px 1fr 25%;
	}
	.card-header-container {
		grid-row-start: 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: end;
	}

	.btn {
		height: 100%;
	}
	.btn-close {
		grid-column-start: 2;
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}
	.card-btn-container {
		margin: 35% 0 20% 0;
		display: grid;
		grid-template-rows: 1fr 1fr 1fr 1fr;
		align-items: start;
		justify-items: center;
	}
	.btn-lang {
		background-color: black;
		border: none;
		box-shadow: none;
		font-size: 18px;
	}
	.card-extra-container {
		grid-row-start: 3;
		padding: 0 50px 0 50px;
		font-size: 14px;
		display: flex;
		align-items: start;
		justify-content: start;
	}
	.card-checkmark-container {
		margin-right: 10px;
	}
	.active-lang {
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
