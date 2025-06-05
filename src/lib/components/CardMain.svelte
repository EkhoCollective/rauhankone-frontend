<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Footer from '$lib/components/Footer.svelte';

	let { toSubmit, toExplore } = $props();
</script>

<div class="card-main-container">
	<div class="card-content">
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
			<div>
				<button class="btn" onclick={() => toSubmit()}>{$_('btn_take_part')}</button>
			</div>
			<div>
				<button class="btn" onclick={() => toExplore()}>{$_('btn_explore')}</button>
			</div>
		</div>
	</div>
	<div class="footer-container">
		<Footer />
	</div>
</div>

<style>
	.card-main-container {
		width: 100%;
		height: 100%;
		background-color: black;
		display: flex;
	}
	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 25px;
	}

	.card-title-container {
		margin: 10% 0 10% 0;
		font-size: 3em;
		line-height: 1em;
	}
	.card-sub-title-container {
		margin: 10% 0 10% 0;
		font-size: 3em;
		line-height: 1em;
	}
	.card-text-container {
		font-size: 0.75em;
		margin: 0 0 10% 0;
	}
	.card-btn-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: start;
		justify-items: center;
	}
	.btn {
		background-color: black;
		border-color: white;
	}

	/* .card-footer-container {
		margin-top: 20%;
		font-size: 0.75em;
	} */
</style>
