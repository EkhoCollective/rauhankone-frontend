<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import '$lib/i18n';
	import { onMount } from 'svelte';
	// import { page } from '$app/state';
	// import { locales, localizeHref } from '$lib/paraglide/runtime.js';
	import { locale, waitLocale } from 'svelte-i18n';
	import type { LayoutLoad } from './$types';

	export const load: LayoutLoad = async () => {
		if (browser) {
			locale.set(window.navigator.language);
		}
		await waitLocale();
	};

	onMount(() => {
		if (browser) {
			const savedLocale = localStorage.getItem('locale');
			if (savedLocale) {
				locale.set(savedLocale);
			} else {
				const navigatorLang = window.navigator.language.split('-')[0]; // Get base language code
				console.log(navigatorLang);
				locale.set(navigatorLang);
			}
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.ico" />
</svelte:head>

{@render children()}

<style>
	:global(body) {
		background-color: black;
		color: white;
		font-family: 'Roboto', sans-serif;
	}
</style>
