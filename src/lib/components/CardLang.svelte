<script lang="ts">
	import { _, locale, waitLocale } from 'svelte-i18n';
	import { SquareCheck } from 'lucide-svelte';
	import { X } from 'lucide-svelte';

	import Loader from '$lib/components/Loader.svelte';

	let { closeLangCard } = $props();

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
</script>

{#await waitLocale()}
	<Loader />
{/await}

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" onclick={() => closeLangCard()}><X /></button>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			{#each languages as { code, name }}
				<button class="btn" onclick={() => handleLocaleChange(code)}>{name}</button>
			{/each}
		</div>
		<!-- Extra Selector -->
		<div class="card-extra-container">
			<p style="justify-self: end; padding-right: 20px"><SquareCheck /></p>
			<p>{$_('btn_translate_check')}</p>
		</div>
	</div>
</div>

<style>
	.card {
		width: 100%;
		height: 100%;
		background-color: black;
		display: flex;
	}
	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 25px;
	}
	.card-header-container {
		display: grid;
		justify-items: end;
	}
	.card-btn-container {
		margin: 35% 0 20% 0;
		display: grid;
		grid-template-rows: 1fr 1fr 1fr 1fr;
		align-items: start;
		justify-items: center;
	}
	.btn {
		background-color: black;
		border-color: white;
		margin-bottom: 20px;
	}
	.card-extra-container {
		display: grid;
		grid-template-columns: 30% 1fr;
		/* margin: 0 0 10% 0; */
		font-size: 0.75em;
		/* width: 50%; */
		text-align: left;
	}
	/* 
	button {
		padding: 1em 0 1em 0;
		margin: 1em 0 0 0;
		border: 1px solid #ccc;
		background: transparent;
		cursor: pointer;
		width: 100%;
	}

	button.active {
		background: grey;
		font-weight: bold;
	} */
	.btn-lang {
		border: none;
		box-shadow: none;
	}
	/* .card-footer-container {
		margin-top: 20%;
		font-size: 0.75em;
	} */
</style>
