<script lang="ts">
	import { _, waitLocale } from 'svelte-i18n';
	import Footer from '$lib/components/mini-components/Footer.svelte';
	import CardLoader from '$lib/components/CardLoader.svelte';
	import BackgroundMouse from '$lib/components/mini-components/BackgroundMouse.svelte';

	let { toSubmit, toExplore } = $props();
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
</script>

<!-- Loader -->
{#await waitLocale()}
	<CardLoader />
{:then}
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
			<button class="btn btn-submit" onclick={() => toSubmit()}>{$_('btn_take_part')}</button>
			<button class="btn btn-explore" onclick={() => toExplore()}>{$_('btn_explore')}</button>
		</div>

		<!-- Footer -->
		<div class="card-footer-container">
			<Footer />
		</div>
	</div>
{/await}

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
</style>
