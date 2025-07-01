<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuthToken } from '$lib/utils/api_token';
	import { apiRequest } from '$lib/utils/api_request';
	import { _, waitLocale } from 'svelte-i18n';
	import Header from '$lib/components/mini-components/Header.svelte';
	import CardLoader from '$lib/components/CardLoader.svelte';
	import CardMain from '$lib/components/CardMain.svelte';
	import CardLang from '$lib/components/CardLang.svelte';
	import CardSubmit from '$lib/components/CardSubmit.svelte';
	import CardExplore from '$lib/components/CardExplore.svelte';
	import CardError from '$lib/components/CardError.svelte';
	import { fade, blur } from 'svelte/transition';

	// UI Toggle states
	let showLang = $state(false);
	let currentCard = $state('main');
	let triggerCard = $state('');
	let transitionDuration = 500;
	let translateStories = $state(false);
	let questions = $state(null);
	let raiseError = $state(false);

	const API_QUESTIONS_OPTIONS = () => ({
		API_ENDPOINT: '/get_questions',
		API_METHOD: 'POST',
		REQUEST_BODY: { question_type: 'starter' }
	});

	let handleToggleLang = () => {
		showLang = !showLang;
	};

	function handleCardView(card: string, cardTrigger: string) {
		currentCard = card;
		triggerCard = cardTrigger;
	}

	async function handleGetToken() {
		await getAuthToken()
			.then(() => {
				handleGetQuestions();
			})
			.catch((error) => {
				console.log('Error getting token', error);
				raiseError = true;
			});
	}

	async function handleGetQuestions() {
		await apiRequest(API_QUESTIONS_OPTIONS())
			.then((response) => {
				questions = response;
			})
			.catch((error) => {
				console.log('Error getting questions', error);
				raiseError = true;
			});
	}

	// Get token and questions
	onMount(() => {
		handleGetToken();
	});

	// Reload page on back button
	$effect(() => {
		window.addEventListener('popstate', () => {
			location.reload();
		});
	});

	// Check for internet connection
	$effect(() => {
		window.addEventListener('offline', () => {
			raiseError = true;
		});
	});
</script>

<svelte:head>
	<title>{$_('rk_title')} | {$_('rk_layer')} | Oulu 2026</title>
</svelte:head>

<!-- Error Card -->
{#if raiseError}
	<div transition:blur class="error-container">
		<CardError errorMessage={$_('error_map')} />
	</div>
{/if}

<!-- Langauge Selector Card -->
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
				backToHome={() => handleCardView('main', 'lang')}
				showBackBtn={currentCard === 'explore'}
			/>
		</div>

		<div class="card-container">
			<!-- Main Card -->
			{#if currentCard === 'main'}
				<div
					in:fade={{ delay: 500, duration: transitionDuration }}
					out:fade={{ delay: 0, duration: transitionDuration }}
					class="main-container"
				>
					<CardMain
						toSubmit={() => handleCardView('submit', 'main')}
						toExplore={() => handleCardView('explore', 'main')}
					/>
				</div>
			{/if}
			<!-- Submit Card -->
			{#if currentCard === 'submit'}
				<div
					in:fade={{ delay: 500, duration: transitionDuration }}
					out:fade={{ duration: transitionDuration }}
					class="submit-container"
				>
					<CardSubmit
						toExplore={() => handleCardView('explore', 'submit')}
						questionsData={questions}
					/>
				</div>
			{/if}
			<!-- Explore Card -->
			{#if currentCard === 'explore'}
				<div
					in:fade={{ delay: 500, duration: transitionDuration }}
					out:fade={{ duration: transitionDuration }}
					class="explore-container"
				>
					<CardExplore getOnlyTranslated={translateStories} triggeredFrom={triggerCard} />
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
		height: 100%;
	}

	.lang-container {
		width: 100vw;
		height: 100vh;
		z-index: 1000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.error-container {
		width: 100vw;
		height: 100vh;
		z-index: 2000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
