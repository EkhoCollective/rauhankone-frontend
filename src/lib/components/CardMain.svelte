<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	export let toSubmit = () => {};
	export let toExplore = () => {};
</script>

<div class="card">
	<div class="card-content">
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
			<p>
				... is part of the dynamic discourse about actions, choices, mutual interactions and power,
				which all greatly affect the processes of peace. <br />
				<br />
				Participate in building a peace machine and share your personal memory about peace.
			</p>
		</div>
		<!-- Buttons Container -->
		<div class="card-btn-container">
			<div class="card-btn">
				<button class="btn" on:click={toSubmit}>Take Part</button>
			</div>
			<div class="card-btn">
				<button class="btn" on:click={toExplore}>Explore</button>
			</div>
		</div>
		<!-- Footer -->
		<div class="card-footer-container">
			<p>Read more about the piece</p>
			<p>© Ekho Collective</p>
			<p>GDPR</p>
		</div>
	</div>
</div>

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
		margin: 15% 0 10% 0;
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
	.card-footer-container {
		margin-top: 20%;
		font-size: 0.75em;
	}
</style>
