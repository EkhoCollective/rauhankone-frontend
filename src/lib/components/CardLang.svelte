<script lang="ts">
	import { onMount } from 'svelte';
	import { setLocale, locales } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import { SquareCheck } from 'lucide-svelte';
	import { X } from 'lucide-svelte';

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

	function handleLocaleChange(locale: Locale) {
		localStorage.setItem('locale', locale);
		setLocale(locale);
		selectedLocale = locale;
	}
	export let toggleLang = () => {};
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" on:click={toggleLang}><X /></button>
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
				<button class="btn" on:click={() => handleLocaleChange('sa')}> Sámegiella </button>
			</div>
		</div>
		<!-- Extra Selector -->
		<div class="card-extra-container">
			<p style="justify-self: end; padding-right: 20px"><SquareCheck /></p>
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
	.card-footer-container {
		margin-top: 20%;
		font-size: 0.75em;
	}
</style>
