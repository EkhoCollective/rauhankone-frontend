<script lang="ts">
	import { _, locale, waitLocale } from 'svelte-i18n';
	import { X } from 'lucide-svelte';
	import Checkmark from '$lib/components/mini-components/CheckIcon.svelte';
	import { Dialog } from 'bits-ui';
	import { soundEffects } from '$lib/utils/soundEffects';
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

	function playUISound() {
		soundEffects.playEffect('Blip_UI');
	}
</script>

<!-- Header/Language Selector -->
<Dialog.Content class="lang-container" trapFocus={true}>
	<div class="card-header-container">
		<Dialog.Close
			class="btn btn-close"
			onclick={() => {
				playUISound();
				closeLangCard();
			}}
		>
			<X color="#ffffff" size={35} />
		</Dialog.Close>
	</div>

	<!-- Buttons Container -->
	<div class="card-btn-container">
		{#each languages as { code, name }, i}
			<button
				class="btn btn-lang"
				class:active-lang={$locale === code}
				onclick={() => {
					playUISound();
					handleLocaleChange(code);
				}}
			>
				{name}
			</button>
		{/each}
	</div>
	<!-- Extra Selector -->

	<!-- Accessable version -->
	<div class="card-extra-container">
		<!-- <Checkmark bind:checkValue={translate} /> -->
		<input
			type="checkbox"
			value={translate}
			id="translate-checkbox"
			name="translate-checkbox"
			onchange={() => (translate = !translate)}
		/>
		<label for="translate-checkbox">{$_('btn_translate_check')}</label>
	</div>
</Dialog.Content>

<style>
	.card-extra-container input[type='checkbox'] {
		width: 25px;
		aspect-ratio: 1;
		margin-right: 10px;
		--accent-color-checkbox: white;
		accent-color: var(--accent-color-checkbox); /* Match Checkmark color if possible */
		border-radius: 3px;
		border: 2px solid var(--accent-color-checkbox);
		background: black;
		appearance: none;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		cursor: pointer;
		transition: box-shadow 0.1s;
	}
	.card-extra-container input[type='checkbox']:checked {
		/* background-color: var(--accent-color-checkbox);
		border-color: var(--accent-color-checkbox); */
	}
	.card-extra-container input[type='checkbox']:checked::after {
		content: '';
		position: absolute;
		left: 6px;
		top: 2px;
		width: 8px;
		height: 14px;
		border: solid white;
		border-width: 0 3px 3px 0;
		transform: rotate(45deg);
	}

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
	.card-checkmark-container {
		margin-right: 10px;
	}
	.active-lang {
		text-decoration: underline;
		font-weight: 400;
		text-underline-offset: 2px;
	}
</style>
