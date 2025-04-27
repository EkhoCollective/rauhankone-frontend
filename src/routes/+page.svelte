<script lang="ts">
	import { onMount } from 'svelte';
	import { setLocale, locales } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import { Canvas } from '@threlte/core';
	import Scene from '../lib/components/Scene.svelte';

	type Locale = (typeof locales)[number];

	let selectedLocale: Locale = 'en'; // fallback
	const username = 'Vertti';

	onMount(() => {
		const savedLocale = localStorage.getItem('locale') as Locale | null;
		if (savedLocale && locales.includes(savedLocale)) {
			selectedLocale = savedLocale;
			setLocale(savedLocale);
		} else {
			setLocale(selectedLocale);
		}
	});

	function handleLocaleChange(event: Event) {
		const target = event.target as HTMLSelectElement | null;
		if (target) {
			const newLocale = target.value as Locale;
			localStorage.setItem('locale', newLocale);
			setLocale(newLocale);
		}
	}
</script>

<p>
	<select bind:value={selectedLocale} on:change={handleLocaleChange}>
		{#each locales as l}
			<option value={l}>{l}</option>
		{/each}
	</select>
</p>

<p>{m.greeting({ username })}</p>

<Canvas>
	<Scene />
</Canvas>
