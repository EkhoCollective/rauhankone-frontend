<script lang="ts">
	import { _, locale, waitLocale } from 'svelte-i18n';
	import CheckIcon from '../mini-components/CheckIcon.svelte';
	import { X } from 'lucide-svelte';
	import { Dialog } from "bits-ui";
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

<!-- Header/Language Selector -->
<Dialog.Content class="lang-container" trapFocus={true}>
		<div class="card-header-container">
			<Dialog.Close class="btn btn-close" onclick={() => closeLangCard()}>
				<X color="#ffffff" size={35} />
			</Dialog.Close>
		</div>

	<!-- Buttons Container -->
	<div class="card-btn-container">
		{#each languages as { code, name }, i}
			<button
				class="btn btn-lang"
				class:active-lang={$locale === code}
				onclick={() => handleLocaleChange(code)}
			>
				{name}
			</button>
		{/each}
	</div>
	<!-- Extra Selector -->

	<!-- Accessable version -->
	<!-- <input 
	type="checkbox"
	value={translate}
	id="translate-checkbox"
	name="translate-checkbox"
	onchange={() => translate = !translate}
	/>
	<label for="translate-checkbox">{$_('header_btn_translate_all')}</label> -->
	<div class="card-extra-container">
		<CheckIcon
		translateIdForCheckbox="header_btn_translate_all"
		bind:checkValue={translate}
		/>
	</div>
</Dialog.Content>

<style>


	

	.btn {
		aspect-ratio: 1;
		height: 50px;
		width: auto;
		color: white;
	}
	.card-btn-container {
		grid-row-start: 2;
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
		font-weight: 200;
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

	.active-lang {
		text-decoration: underline;
		font-weight: 400;
		text-underline-offset: 2px;
	}
</style>
