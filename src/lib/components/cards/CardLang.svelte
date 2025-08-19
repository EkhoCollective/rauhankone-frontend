<script lang="ts">


	import { _, locale, waitLocale } from 'svelte-i18n';
	import CheckIcon from '../mini-components/CheckIcon.svelte';
	import { X } from 'lucide-svelte';
	import { Dialog } from "bits-ui";
	import DialogContent from '../DialogContent.svelte';
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
<DialogContent class="lang-container" trapFocus={true}>
		<div class="card-header-container">
			<Dialog.Close class="square-icon-button" onclick={() => closeLangCard()}>
				<X color="#ffffff" size={35} />
			</Dialog.Close>
		</div>

	<!-- Buttons Container -->
	<div class="card-btn-container">
		{#each languages as { code, name }, i}
			<button
				class="btn-lang"
				class:active-lang={$locale === code}
				onclick={() => handleLocaleChange(code)}
			>
				{name}
			</button>
		{/each}
	</div>

	<div class="card-extra-container">
		<CheckIcon
		translateIdForCheckbox="header_btn_translate_all"
		bind:checkValue={translate}
		/>
	</div>
</DialogContent>

<style>

	
	

	.card-btn-container {
		grid-row-start: 2;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		justify-items: center;
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
