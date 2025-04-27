<script lang="ts">
	import { onMount } from 'svelte';
	import { setLocale, locales } from '$lib/paraglide/runtime.js';
	import Icon from 'svelte-awesome';
	import close from 'svelte-awesome/icons/close';
	import { m } from '$lib/paraglide/messages.js';

	type Locale = (typeof locales)[number];

	let selectedLocale: Locale = 'en'; // fallback

	onMount(() => {
		const savedLocale = localStorage.getItem('locale') as Locale | null;
		if (savedLocale && locales.includes(savedLocale)) {
			selectedLocale = savedLocale;
			setLocale(savedLocale);
		} else {
			setLocale(selectedLocale);
		}
	});

	// function handleLocaleChange(event: Event) {
	// 	const target = event.target as HTMLSelectElement | null;
	// 	if (target) {
	// 		const newLocale = target.value as Locale;
	// 		localStorage.setItem('locale', newLocale);
	// 		setLocale(newLocale);
	// 	}
	// }
	function handleLocaleChange(locale: Locale) {
		localStorage.setItem('locale', locale);
		setLocale(locale);
		selectedLocale = locale;
	}
	export let toMain = () => {};
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" on:click={toMain}><Icon data={close} scale={1} /></button>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			<!-- <div>
				<button
					class={selectedLocale === 'en' ? 'active' : ''}
					on:click={() => handleLocaleChange('en')}
				>
					English
				</button>
			</div>
			<div>
				<button
					class={selectedLocale === 'fi' ? 'active' : ''}
					on:click={() => handleLocaleChange('fi')}
				>
					Suomi
				</button>
			</div>
			<div>
				<button
					class={selectedLocale === 'sv' ? 'active' : ''}
					on:click={() => handleLocaleChange('sv')}
				>
					Svenska
				</button>
			</div>
			<div>
				<button
					class={selectedLocale === 'sa' ? 'active' : ''}
					on:click={() => handleLocaleChange('sa')}
				>
					Deutsch
				</button>
			</div> -->
			<div>
				<button class="btn" on:click={() => handleLocaleChange('en')}> English </button>
			</div>
			<div>
				<button class="btn" on:click={() => handleLocaleChange('fi')}> Suomi </button>
			</div>
			<div>
				<button class="btn" on:click={() => handleLocaleChange('sv')}> Svenska </button>
			</div>
			<div>
				<button class="btn" on:click={() => handleLocaleChange('sa')}> Deutsch </button>
			</div>
		</div>
		<!-- Extra Selector -->
		<div class="card-extra-container">
			<p>Translate all stories to selected language</p>
		</div>
		<!-- Footer -->
		<div class="card-footer-container">
			<p>{m.read_more()}</p>
			<p>© Ekho Collective</p>
			<p>GDPR</p>
		</div>
	</div>
</div>

<!-- NOTES
 

-->

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
	.card-footer-container {
		margin-top: 60%;
		font-size: 0.75em;
	}
</style>
