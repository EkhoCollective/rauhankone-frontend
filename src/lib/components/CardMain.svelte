<script lang="ts">
	import { _ } from 'svelte-i18n';

	export let toSubmit = () => {};
	export let toExplore = () => {};
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<!-- <div class="card-header-container">
			<button class="btn btn-lang" on:click={toLang}><Globe /></button>
		</div> -->
		<!-- Title -->
		<div class="card-title-container">
			<div>{$_('rk_title')}</div>
		</div>
		<!-- Main Text -->
		<div class="card-text-container">
			<div>{$_('description')}</div>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			<div>
				<button class="btn" on:click={toSubmit}>Take Part</button>
			</div>
			<div>
				<button class="btn" on:click={toExplore}>Explore</button>
			</div>
		</div>
	</div>
</div>

<!-- NOTES
 
- change icon
- check font style
- buttons styling
- title separtion to paraglide schema

-->

<style>
	.card {
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
