<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import BackgroundMouse from '$lib/components/mini-components/BackgroundMouse.svelte';
	// import { onMount } from 'svelte';
	// import { page } from '$app/state';
	// import { beforeNavigate } from '$app/navigation';
	// // import { getAuthToken } from '$lib/utils/api_token';
	// // import { apiRequest } from '$lib/utils/api_request';
	// // import { _, waitLocale } from 'svelte-i18n';
	// import Header from '$lib/components/mini-components/Header.svelte';
	// import CardLoader from '$lib/components/cards/CardLoader.svelte';
	// import CardMain from '$lib/components/cards/CardMain.svelte';
	// import CardLang from '$lib/components/cards/CardLang.svelte';
	// // import CardSubmit from '$lib/components/cards/CardSubmit.svelte';
	// // import CardExplore from '$lib/components/cards/CardExplore.svelte';
	// // import CardError from '$lib/components/cards/CardError.svelte';
	// import { fade, blur } from 'svelte/transition';

	let backgroundRef: BackgroundMouse | undefined = $state();

	function handleMouseMove(e: MouseEvent) {
		if (backgroundRef) {
			backgroundRef.updateCoords(e);
		}
	}

	function splitA(text: string): string {
		return text.slice(0, text.indexOf('.') + 1);
	}

	function splitB(text: string): string {
		return text.slice(text.indexOf('.') + 1);
	}

	// // UI Toggle states
	// let showLang = $state(false);
	// let currentCard = $state('main');
	// let triggerCard = $state('');
	// let transitionDuration = 500;
	// let translateStories = $state(false);
	// let questions = $state(null);
	// let raiseError = $state(false);

	// const API_QUESTIONS_OPTIONS = () => ({
	// 	API_ENDPOINT: '/get_questions',
	// 	API_METHOD: 'POST',
	// 	REQUEST_BODY: { question_type: 'starter' }
	// });

	// let handleToggleLang = () => {
	// 	showLang = !showLang;
	// };

	// function handleCardView(card: string, cardTrigger: string) {
	// 	currentCard = card;
	// 	triggerCard = cardTrigger;
	// }

	// async function handleGetToken() {
	// 	await getAuthToken()
	// 		.then(() => {
	// 			handleGetQuestions();
	// 		})
	// 		.catch((error) => {
	// 			console.log('Error getting token', error);
	// 			raiseError = true;
	// 		});
	// }

	// async function handleGetQuestions() {
	// 	await apiRequest(API_QUESTIONS_OPTIONS())
	// 		.then((response) => {
	// 			questions = response;
	// 		})
	// 		.catch((error) => {
	// 			console.log('Error getting questions', error);
	// 			raiseError = true;
	// 		});
	// }

	// Get token and questions
	// onMount(() => {
	// 	window.scrollTo(0, 0);
	// 	handleGetToken();
	// });

	// beforeNavigate(({ type }) => {
	// 	if (type === 'popstate') {
	// 		location.reload();
	// 	}
	// });

	// Check for internet connection
	// $effect(() => {
	// 	window.addEventListener('offline', () => {
	// 		raiseError = true;
	// 	});
	// });
</script>

<svelte:head>
	<title>{$_('rk_title')} | {$_('rk_layer')} | Oulu 2026</title>
</svelte:head>

<div class="card-bg-container">
	<BackgroundMouse bind:this={backgroundRef} maxMovement={75} stiffness={0.05} damping={0.95} />
</div>
<div class="card-main-container" onmousemove={handleMouseMove} role="presentation">
	<!-- Title -->
	<div class="card-title-container">
		<div>{$_('rk_title')}</div>
	</div>
	<!-- Subtitle -->
	<div class="card-sub-title-container">
		<div>{$_('rk_layer')}</div>
	</div>
	<!-- Main Text -->
	<div class="card-description-container">
		<div>{splitA($_('description'))}<br /><br />{splitB($_('description'))}</div>
	</div>
	<!-- Buttons Container -->
	<div class="card-btn-container">
		<button class="btn btn-submit" onclick={() => goto('/submit')}>{$_('btn_take_part')}</button>
		<button class="btn btn-explore" onclick={() => goto('/explore')}>{$_('btn_explore')}</button>
	</div>
</div>

<!-- Error Card -->
<!-- {#if raiseError}
	<div transition:blur class="error-container">
		<CardError errorMessage={$_('error_general')} />
	</div>
{/if} -->

<!-- Langauge Selector Card -->
<!-- {#if showLang}
	<div
		in:fade={{ duration: transitionDuration }}
		out:fade={{ duration: transitionDuration }}
		class="lang-container"
	>
		<CardLang closeLangCard={handleToggleLang} bind:translate={translateStories} />
	</div>
{/if} -->

<!-- Loader -->
<!-- {#await waitLocale()}
	<CardLoader />
{:then} -->
<!-- <div
		in:fade={{ duration: transitionDuration }}
		out:fade={{ duration: transitionDuration }}
		class="app-container"
	>
		Header
		<div class="header-container">
			<Header
				toggleLang={handleToggleLang}
				backToHome={() => handleCardView('main', 'lang')}
				showBackBtn={currentCard === 'explore'}
			/>
		</div>

		<div class="card-container">
			Main Card
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
			Submit Card
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
			Explore Card
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
	</div> -->
<!-- {/await} -->

<style>
	.card-bg-container {
		display: none;
	}

	.card-main-container {
		width: 100vw;
		height: 100vh;
		/* background-color: black; */
		display: grid;
		grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
		padding: 50px 10% 50px 10%;
	}

	.card-title-container {
		grid-row-start: 1;
		font-size: 24px;
		width: 50%;
		line-height: 1.25em;
		align-self: center;
	}

	.card-sub-title-container {
		grid-row-start: 2;
		font-size: 46px;
		font-weight: bold;
		line-height: 1.25em;
	}
	.card-description-container {
		grid-row-start: 3;
		font-size: 16px;
	}
	.card-btn-container {
		grid-row-start: 4;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		align-items: center;
		justify-items: center;
	}
	.btn-submit {
		background-color: black;
		border-color: white;
		box-shadow: none;
		width: 100%;
		font-size: 16px;
		border-radius: 0px;
		color: white;
	}

	.audio-icon-container {
		position: absolute;
		z-index: 100;
		bottom: 20px;
		left: 20px;
	}

	.btn-explore {
		background-color: black;
		border-color: none;
		border: none;
		box-shadow: none;
		width: 100%;
		font-size: 16px;
		text-decoration: underline;
		text-underline-offset: 2px;
		border-radius: 0px;
		color: white;
	}
	.card-footer-container {
		grid-row-start: 5;
		border-top: 1px solid white;
		padding-top: 10px;
		font-size: 14px;
	}

	@media (min-width: 768px) {
		.card-bg-container {
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}

		.card-main-container {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 100;
			grid-template-rows: 1fr 1fr 1fr 1fr;
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'title title'
				'subtitle btn-container'
				'text btn-container'
				'footer footer';
		}

		.card-title-container {
			grid-area: title;
		}

		.card-sub-title-container {
			grid-area: subtitle;
		}

		.card-description-container {
			grid-area: text;
		}

		.card-btn-container {
			grid-area: btn-container;
			display: flex;
			flex-direction: column;
			gap: 20px;
			/* width: 170px; */
			align-items: center;
			justify-content: center;
		}

		.btn-submit,
		.btn-explore {
			width: 170px;
		}

		.card-footer-container {
			grid-area: footer;
			border-top: none;
			/* justify-items: start; */
		}
	}
	.app-container {
		height: 100vh;
	}

	.header-container {
		height: 50px;
		z-index: 1000;
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
		z-index: 2000;
		position: absolute;
		top: 0;
		left: 0;
		/* transform: translate(-50%, -50%); */
	}

	.error-container {
		width: 100vw;
		height: 100vh;
		z-index: 3000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
