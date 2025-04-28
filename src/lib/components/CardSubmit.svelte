<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { ArrowLeft } from 'lucide-svelte';
	export let toMain = () => {};
	export let toExplore = () => {};
</script>

<div class="card">
	<div class="card-content">
		<!-- Header/Language Selector -->
		<div class="card-header-container">
			<button class="btn btn-lang" on:click={toMain}><ArrowLeft /> </button>
		</div>
		<!-- Main Text -->
		<div class="card-text-container">
			<p>
				{m.submit_info()}
			</p>
		</div>
		<!-- Input Area -->
		<div class="card-input-container">
			<textarea rows="10" cols="50" placeholder="Your memory here..."></textarea>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			<div>
				<button class="btn" on:click={toExplore}>{m.submit()}</button>
			</div>
		</div>
		<!-- Footer -->
		<div class="card-footer-container">
			<p>{m.read_more()}</p>
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
	.card-input-container {
		margin: 10% 0 10% 0;
		border: 1px solid white;
		/* font-size: 3em; */
		/* line-height: 1em; */
	}

	textarea {
		width: 100%;
		height: 200px;
	}
	.card-text-container {
		font-size: 0.75em;
		margin: 0 0 10% 0;
	}
	.card-btn-container {
		display: grid;
		grid-template-columns: 1fr;
		align-items: start;
		justify-items: end;
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
		margin-top: 50%;
		font-size: 0.75em;
	}
</style>
