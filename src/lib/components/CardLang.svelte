<script lang="ts">
	import { _, locale, waitLocale } from 'svelte-i18n';
	import { X } from 'lucide-svelte';
	import Checkmark from '$lib/components/mini-components/CheckIcon.svelte';

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
			closeLangCard(false);
		});
	}
</script>

<div class="card-lang-container">
	<!-- Header/Language Selector -->
	<div class="card-header-container">
		<button class="btn btn-close" onclick={() => closeLangCard()}><X color="#ffffff" /></button>
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
		width: 100vw;
		height: 100vh;
		background-color: black;
		display: grid;
		grid-template-rows: 50px 1fr 25%;
	}
	.card-header-container {
		grid-row-start: 1;
		display: flex;
		justify-content: flex-end;
	}

	.btn {
		height: 50px;
		color: white;
	}
	.btn-close {
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}
	.card-btn-container {
		grid-row-start: 2;
		padding-top: 30vh;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		justify-items: center;
	}
	.btn-lang {
		background-color: black;
		border: none;
		box-shadow: none;
		font-size: 18px;
		color: white;
	}
	.card-extra-container {
		grid-row-start: 3;
		font-size: 18px;
		display: flex;
		justify-self: center;
		align-items: start;
		justify-content: center;
		max-width: 75%;
	}
	.card-checkmark-container {
		margin-right: 10px;
	}
	.active-lang {
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
