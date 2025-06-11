<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Footer from '$lib/components/Footer.svelte';

	let { toSubmit, toExplore } = $props();
</script>

<div class="card-main-container">
	<!-- Title -->
	<div class="card-title-container">
		<div>{$_('rk_title')}</div>
	</div>
	<!-- Subtitle -->
	<div class="card-sub-title-container">
		<div>{$_('rk_layer')}</div>
	</div>
	<!-- Main Text -->
	<div class="card-text-container">
		<div>{$_('description')}</div>
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

<style>
	.card-main-container {
		width: 100%;
		height: calc(100vh - 50px);
		background-color: black;
		display: grid;
		grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
		padding: 0 10% 0 10%;
	}

	.card-title-container {
		grid-row-start: 1;
		font-size: 1.25em;
		width: 50%;
		line-height: 1.25em;
		align-self: center;
	}

	.card-sub-title-container {
		grid-row-start: 2;
		font-size: 2.25em;
		font-weight: bold;
		line-height: 1.25em;
	}
	.card-text-container {
		grid-row-start: 3;
		font-size: 0.75em;
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
		font-size: 0.75em;
		border-radius: 0px;
	}

	.btn-explore {
		background-color: black;
		border-color: none;
		border: none;
		box-shadow: none;
		width: 100%;
		font-size: 0.75em;
		text-decoration: underline;
		text-underline-offset: 2px;
		border-radius: 0px;
	}
	.card-footer-container {
		grid-row-start: 5;
		border-top: 1px solid white;
		padding-top: 10px;
		font-size: 0.75em;
	}
</style>
