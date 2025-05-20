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
				locale.set(navigatorLang);
			}
		}
	});

	let { children } = $props();
</script>

{@render children()}

<!-- <div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div> -->

<style>
	:global(body) {
		background-color: black;
		color: white;
	}
</style>
