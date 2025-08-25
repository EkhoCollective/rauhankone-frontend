<script lang="ts">
	import { page } from '$app/state';
	import CardLang from '$lib/components/cards/CardLang.svelte';
	import CardLoader from '$lib/components/cards/CardLoader.svelte';
	import Header from '$lib/components/mini-components/Header.svelte';
	import '$lib/i18n';
	import { getAuthToken } from '$lib/utils/api_token';
	import { Dialog } from 'bits-ui';
	import { setContext } from 'svelte';
	import { onMount } from 'svelte';
	import { init, waitLocale, _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import '../app.css';
	import { customErrorHandler } from '$lib/utils/customErrrorHandler';
	import { resolve } from '$app/paths';

	let { children } = $props();
	let showLang = $state(false);
	let transitionDuration = 100;
	let translateStories = $state(false);
	let pathName = $state<string | null>(null);

	// Navigation context state
	let navigationSource = $state<'main' | 'submit' | null>(null);
	let submittedStoryId = $state<string | null>(null);

	// Set navigation context
	setContext('navigation', {
		setSource: (source: 'main' | 'submit') => {
			navigationSource = source;
		},
		setSubmittedStoryId: (storyId: string) => {
			submittedStoryId = storyId;
		},
		getNavigationData: () => ({
			source: navigationSource,
			storyId: submittedStoryId
		}),
		clearNavigation: () => {
			navigationSource = null;
			submittedStoryId = null;
		}
	});

	// Set translation context
	setContext('translation', {
		get translateStories() {
			return translateStories;
		},
		setTranslateStories: (value: boolean) => {
			translateStories = value;
		}
	});

	// Set context at component initialization
	// setContext('questions', () => questions);

	init({
		fallbackLocale: 'en',
		initialLocale: 'en'
	});

	async function handleGetToken() {
		await getAuthToken().catch((err) => {
			console.error('Error getting token:', err);
			customErrorHandler($_('error.authFailed'), err.code);
		});
	}

	let handleToggleLangDialog = () => {
		showLang = !showLang;
	};

	onMount(() => {
		window.scrollTo(0, 0);
		handleGetToken();
		pathName = window.location.origin;
	});

	// $inspect(questions);
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.ico" />
	<title
		>{$_('main_title', { default: 'Layers in the Peace Machine' })} | {$_('main_subtitle', {
			default: 'The Layer of Sharing'
		})} | Oulu 2026</title
	>
	<meta
		name="description"
		content={$_('main_description', {
			default:
				"The Peace Machine is built together, layer by layer – from each person's stories, perspectives, and the shared will to create peace. Share your own personal memory and you will be part of the Peace Machine. You can also explore memories shared by others."
		})}
	/>
	<link rel="canonical" href={pathName} />
	<meta name="theme-color" content="#000000" />
	<script type="application/ld+json">
    {
    "@context": "http://schema.org",
    "@type": "WebPage",
    "name": $_("main_title", { default: "Layers in the Peace Machine"}),
    "description": $_("main_description", { default: "The Peace Machine is built together, layer by layer – from each person's stories, perspectives, and the shared will to create peace. Share your own personal memory and you will be part of the Peace Machine. You can also explore memories shared by others."}),
	}
	</script>

	<meta property="og:url" content={resolve('/')} />
	<meta
		property="og:title"
		content={$_('main_title', { default: 'Layers in the Peace Machine' })}
	/>
	<meta
		property="og:description"
		content={$_('main_description', {
			default:
				"The Peace Machine is built together, layer by layer – from each person's stories, perspectives, and the shared will to create peace. Share your own personal memory and you will be part of the Peace Machine. You can also explore memories shared by others."
		})}
	/>
	<!-- <meta property="og:image:url" content={resolve('/favicon.ico')} /> -->

	<meta name="twitter:card" content="summary" />
	<meta
		name="twitter:title"
		content={$_('main_title', { default: 'Layers in the Peace Machine' })}
	/>
	<meta
		name="twitter:description"
		content={$_('main_description', {
			default:
				"The Peace Machine is built together, layer by layer – from each person's stories, perspectives, and the shared will to create peace. Share your own personal memory and you will be part of the Peace Machine. You can also explore memories shared by others."
		})}
	/>
	<meta name="twitter:image" content={'/favicon.ico'} />
	<meta
		name="twitter:image:alt"
		content={$_('main_title', { default: 'Layers in the Peace Machine' })}
	/>
</svelte:head>

<div class="app">
	<!-- Loader -->
	{#await waitLocale()}
		<CardLoader />
	{:then}
		<!-- Lang Dialog -->
		<Dialog.Root bind:open={showLang}>
			<Dialog.Portal>
				<CardLang closeLangCard={handleToggleLangDialog} bind:translate={translateStories} />
			</Dialog.Portal>
		</Dialog.Root>

		<!-- Header -->
		<Header toggleLang={handleToggleLangDialog} {showLang} />

		<!-- Pages -->
		{#key page.url.pathname}
			<main
				class="page-container"
				in:fade={{ duration: transitionDuration }}
				out:fade={{ duration: transitionDuration }}
			>
				{@render children()}
			</main>
		{/key}
	{/await}
</div>

<style>
	.app {
		background-color: black;
		color: white;
		font-family: 'Roboto', sans-serif;
	}
</style>
