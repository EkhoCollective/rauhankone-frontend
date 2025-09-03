<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { base, resolve } from '$app/paths';
	import { getContext, onMount } from 'svelte';
	import BackgroundMouse from '$lib/components/mini-components/BackgroundMouse.svelte';
	import Footer from '$lib/components/mini-components/Footer.svelte';
	import { useAudio } from '$lib/composables/useAudio';

	// Get navigation context from layout
	const navigationContext = getContext('navigation') as {
		setSource: (source: 'main' | 'submit') => void;
		setSubmittedStoryId: (storyId: string) => void;
		getNavigationData: () => { source: 'main' | 'submit' | null; storyId: string | null };
		clearNavigation: () => void;
	};

	const { playBlip, switchToPage } = useAudio();

	let backgroundRef: BackgroundMouse | undefined = $state();

	// Set audio context when component mounts
	onMount(() => {
		switchToPage('main');
	});

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

	function playUISound() {
		playBlip();
	}
</script>

<svelte:head>
	<title>{$_('main_title')} | {$_('main_subtitle')} | Oulu 2026</title>
</svelte:head>

<main class="card-main-container" onmousemove={handleMouseMove} role="presentation">
	<div class="card-bg-container">
		<BackgroundMouse
			bind:this={backgroundRef}
			maxMovement={75}
			stiffness={0.05}
			damping={0.95}
			bgImage="/main_bg.png"
		/>
	</div>
	<div class="card-main-container-inner">
		<!-- Title -->
		<div class="card-title-container">
			<h1>{$_('main_title')}</h1>
		</div>
		<!-- Subtitle -->
		<div class="card-sub-title-container">
			<h2>{$_('main_subtitle')}</h2>
		</div>
		<!-- Main Text -->
		<div class="card-description-container">
			<p>{splitA($_('main_description'))}<br /><br />{splitB($_('main_description'))}</p>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			<button
				data-variant="primary"
				onclick={() => {
					playUISound();
					goto(resolve('/submit'));
				}}
			>
				{$_('main_btn_take_part')}
			</button>
			<button
				class="btn"
				data-variant="secondary"
				onclick={() => {
					playUISound();
					navigationContext.setSource('main');
					goto(resolve('/explore'));
				}}
			>
				{$_('main_btn_explore')}</button
			>
		</div>
		<!-- Footer -->
		<div class="card-footer-container">
			<Footer />
		</div>
	</div>
</main>

<style>
	.card-bg-container {
		display: none;
	}

	.card-main-container {
		display: flex;
		margin-top: 0;
		max-height: 100%;
		min-height: 100%;
		max-width: 100%;
		min-width: 100%;
		flex-grow: 1;
		/* background-color: rgb(0, 0, 0); */
	}

	.card-main-container-inner {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: auto;
		z-index: 0;
		max-height: 100%;
		min-height: 100%;
		max-width: 100%;
		min-width: 100%;
		padding: var(--pad-3);
	}

	.card-title-container {
		grid-row-start: 1;
		max-width: 50%;
		display: flex;
		align-items: center;
	}

	.card-title-container h1 {
		font-size: var(--f24);
		font-weight: 400;
		line-height: 1.2;
	}

	.card-sub-title-container {
		grid-row-start: 2;
		font-size: var(--f46);
		font-weight: bold;
		line-height: 1.25em;
		max-width: 65%;
		padding-bottom: var(--base-padding);
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.card-description-container {
		margin-top: var(--pad-5);
		grid-row-start: 3;
		font-size: var(--f16);
	}
	.card-btn-container {
		margin-top: var(--pad-4);
		margin-bottom: var(--pad-5);
		display: flex;
		flex-direction: row;
		max-width: 100%;
		gap: 10px;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.card-footer-container {
		border-top: 1px solid white;
		margin-top: var(--pad-5);
		font-size: var(--f14);
	}

	@media (min-width: 768px) {
		.card-bg-container {
			max-width: 100%;
			width: 100%;
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 0;
		}

		.card-main-container-inner {
			max-width: 100%;
			grid-template-rows:
				max-content
				max-content
				max-content
				1fr;
			--pad-side: 10%;
			padding-top: 10%;
			grid-template-columns: var(--pad-side) 1fr 0.5fr var(--pad-side);
			grid-template-areas:
				'.	title 			btn-container		.'
				'.	subtitle 		btn-container		.'
				'.	text-area 		btn-container		.'
				'footer-container	footer-container 	. .';
		}
		.card-title-container {
			grid-area: title;
			max-width: 80%;
			margin-bottom: 15px;
		}

		.card-sub-title-container {
			grid-area: subtitle;
			max-width: 50%;
			margin-bottom: 20px;
		}

		.card-description-container {
			margin: 0;
			grid-area: text-area;
		}

		.card-btn-container {
			grid-area: btn-container;
			flex-direction: column;
			justify-content: center;
			gap: 20px;
		}

		.card-footer-container {
			display: flex;
			align-items: flex-end;
			padding-left: var(--pad-5);
			padding-bottom: var(--pad-5);
			grid-area: footer-container;
			border: none;
		}
	}
</style>
