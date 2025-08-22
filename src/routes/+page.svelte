<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
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

<div class="card-main-container" onmousemove={handleMouseMove} role="presentation">
	<div class="card-bg-container">
		<BackgroundMouse bind:this={backgroundRef} maxMovement={75} stiffness={0.05} damping={0.95} />
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
				class="btn btn-submit"
				onclick={() => {
					playUISound();
					goto(`${base}/submit`);
				}}
			>
				{$_('main_btn_take_part')}
			</button>
			<button
				class="btn btn-explore"
				onclick={() => {
					playUISound();
					navigationContext.setSource('main');
					goto(`${base}/explore`);
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
</div>

<style>
	.card-bg-container {
		display: none;
	}

	.card-main-container {
		display: grid;
		width: 100%;
		height: 100%;
		background-color: black;
	}

	.card-main-container-inner {
		background-color: black;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 1fr;
		padding: 50px 10% 50px 10%;
		z-index: 50;

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
		padding-bottom: var(--base-padding);
	}
	.card-description-container {
		grid-row-start: 3;
		font-size: 16px;
	}
	.card-btn-container {
		display: flex;
		flex-direction: row;
		gap: 20px;
		align-items: center;
		justify-items: center;
		justify-content: space-between;
	}

	.btn-submit {
		/*Unset all effects*/
		all: unset;
		background-color: black;
		border-color: white;
		border: 1px solid white;
		box-shadow: none;
		width: 100%;
		font-size: 16px;
		border-radius: 0px;
		color: white;
	}

	.btn-explore {
		all: unset;
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

	.btn-submit,
	.btn-explore {
		width: 170px;
		height: 40px;
		text-align: center;
		font-weight: 500;
		cursor: pointer;
	}


	.btn-explore:focus,
	.btn-submit:focus {
    outline-color: rgb(163, 180, 255);
    outline-offset: 3px;
    outline-style: solid;
    outline-width: 1px;
    border-radius: 1.4px;
  }

	@media (min-width: 768px) {
		.card-bg-container {
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}

		.card-main-container-inner {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 100;
			grid-template-rows: 1fr 1fr 1fr 1fr;
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'title 			title'
				'subtitle 		btn-container'
				'text-area 		btn-container'
				'footer-area 	footer-area';
		}
		.card-title-container {
			grid-area: title;
		}

		.card-sub-title-container {
			grid-area: subtitle;
		}

		.card-description-container {
			grid-area: text-area;
		}

		.card-btn-container {
			grid-area: btn-container;
			flex-direction: column;
			justify-content: center;
		}

		.card-footer-container {
			grid-area: footer-area;
			border-top: none;
			/* justify-items: start; */
		}
	}
</style>
