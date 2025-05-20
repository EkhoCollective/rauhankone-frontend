<script lang="ts">
	// import { m } from '$lib/paraglide/messages.js';
	import { _ } from 'svelte-i18n';
	import { Globe } from 'lucide-svelte';
	export let toLang = () => {};
	export let toSubmit = () => {};
	export let toExplore = () => {};

	// export let rk_title: string;
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" on:click={toLang}><Globe /></button>
		</div>
		<!-- Title -->
		<div class="card-title-container">
			<p>
				Layers<br />
				of<br />
				the<br />
				Peace<br />
				Machine
			</p>
		</div>
		<!-- Main Text -->
		<div class="card-text-container">
			<!-- <p>{m.description()}</p> -->
			<div>{$_('rk_title')}</div>
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
		<!-- Footer -->
		<div class="card-footer-container">
			<!-- <p>{m.read_more()}</p> -->
			<p>© Ekho Collective</p>
			<p>GDPR</p>
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
	.card-header-container {
		display: grid;
		justify-items: end;
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
	.btn-lang {
		border: none;
		box-shadow: none;
	}
	.card-footer-container {
		margin-top: 20%;
		font-size: 0.75em;
	}
</style>
