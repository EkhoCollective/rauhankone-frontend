<script lang="ts">


	import { _, locale, waitLocale } from 'svelte-i18n';
	import CheckIcon from '../mini-components/CheckIcon.svelte';
	import { X } from 'lucide-svelte';
	import { Dialog } from 'bits-ui';
	import { playBlip } from '$lib/composables/useAudio';
	import DialogContent from '../DialogContent.svelte';
	let { closeLangCard, translate = $bindable() } = $props();

	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'fi', name: 'Suomi' },
		/* { code: 'sv', name: 'Svenska' },
		{ code: 'sa', name: 'Sámegiella' } */
	];

	async function handleLocaleChange(lang_code: string) {
		locale.set(lang_code);
		localStorage.setItem('locale', lang_code);
		await waitLocale().then(() => {
			closeLangCard(false);

		});
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.id === "lang-card-outside-area") {
			closeLangCard(false);
		}
	}

	function playUISound() {
		playBlip();
	}
</script>

<!-- Header/Language Selector -->
<DialogContent class="lang-container" id="lang-card-outside-area"trapFocus={true} onclick={handleClickOutside}>
	<div class="top-right-buttons">
		<Dialog.Close
			id="close-langcard-button"
			class="square-button"
			onclick={() => {
				playUISound();
				closeLangCard();
			}}
		>
			<X color="#ffffff" size={35} />
		</Dialog.Close>
	</div>


	<!-- Buttons Container -->
	<div class="lang-card-langbuttons">
		{#each languages as { code, name }, i}
			<button
				data-variant="lang"
				data-selected={$locale?.startsWith(code)}
				onclick={() => {
					playUISound();
					handleLocaleChange(code);
				}}
				aria-pressed={$locale?.startsWith(code) ? 'true' : 'false'}
				aria-label={$_('header_btn_language') + ' ' + name}
			>
				{name}
			</button>
		{/each}
	</div>

	<div class="card-extra-container">
		<CheckIcon
		translateIdForCheckbox="header_btn_translate_all"
		bind:checkValue={translate}
		hideLabel={false}
		/>
	</div>
</DialogContent>

<style>


.lang-card-langbuttons {
	grid-row-start: 2;
	display: flex;
	height: 100%;
	width: fit-content;
	margin-left: auto;
	margin-right: auto;
	flex-direction: column;
	gap: 30px;
	align-items: center;
	justify-content: center;
	padding-bottom: 10%;
}




	.card-extra-container {
		grid-row-start: 3;
		font-size: var(--f18);
		display: flex;
		justify-self: center;
		align-items: start;
		justify-content: center;
		max-width: 75%;
	}



</style>
