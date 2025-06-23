<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuthToken } from '$lib/utils/api_token';
	import { _, waitLocale } from 'svelte-i18n';
	import Header from '$lib/components/Header.svelte';
	import CardLoader from '$lib/components/CardLoader.svelte';
	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';
	import { fade } from 'svelte/transition';

	// UI Toggle states
	let showLang = $state(false);
	let currentCard = $state('main');
	let transitionDuration = 500; // milliseconds
	let translateStories = $state(false);

	let handleToggleLang = () => {
		showLang = !showLang;
	};

	function handleCardView(card: string) {
		currentCard = card;
	}

	async function handleGetToken() {
		await getAuthToken();
	}

	onMount(() => {
		handleGetToken();
	});
	// Console log to check state changes in svelte
	$inspect('currentCard', currentCard);
</script>

<svelte:head>
	<title>{$_('rk_title')} | {$_('rk_layer')} | Oulu 2026</title>
</svelte:head>

<!-- Lnagauge Selector Card -->
{#if showLang}
	<div
		in:fade={{ duration: transitionDuration }}
		out:fade={{ duration: transitionDuration }}
		class="lang-container"
	>
		<CardLang closeLangCard={handleToggleLang} bind:translate={translateStories} />
	</div>
{/if}

<!-- Loader -->
{#await waitLocale()}
	<CardLoader />
{:then}
	<div
		in:fade={{ duration: transitionDuration }}
		out:fade={{ duration: transitionDuration }}
		class="app-container"
	>
		<!-- Header -->
		<div class="header-container">
			<Header
				toggleLang={handleToggleLang}
				backToHome={() => handleCardView('main')}
				showBackBtn={currentCard !== 'main'}
			/>
		</div>

		<div class="card-container">
			<!-- Submit Card -->
			{#if currentCard === 'submit'}
				<div
					in:fade={{ delay: 0, duration: transitionDuration }}
					out:fade={{ duration: transitionDuration }}
					class="submit-container"
				>
					<CardSubmit toExplore={() => handleCardView('explore')} />
				</div>
			{/if}
			<!-- Explore Card -->
			{#if currentCard === 'explore'}
				<div
					in:fade={{ duration: transitionDuration }}
					out:fade={{ duration: transitionDuration }}
					class="explore-container"
				>
					<CardExplore getOnlyTranslated={translateStories} />
				</div>
			{/if}
			<!-- Main Card -->
			{#if currentCard === 'main'}
				<div
					in:fade={{ delay: 500, duration: transitionDuration }}
					out:fade={{ delay: 0, duration: transitionDuration }}
					class="main-container"
				>
					<CardMain
						toSubmit={() => handleCardView('submit')}
						toExplore={() => handleCardView('explore')}
					/>
				</div>
			{/if}
		</div>
	</div>
{/await}

<style>
	.app-container {
		height: 100vh;
	}

	.header-container {
		height: 50px;
		z-index: 2;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}

	.card-container {
		z-index: 1;
		height: 100%;
	}

	.lang-container {
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
