<script lang="ts">
	let showForm = false;
	let inputValue = '';
	let subtitle =
		'... is part of the dynamic discourse about actions, choices, mutual interactions and power, which all greatly affect the processes of peace.';

	function toggleForm() {
		showForm = true;
		subtitle =
			'Participate in building a peace machine and share your personal memory about peace.';
	}

	export let onSubmit = (inputValue: string) => {};
</script>

<div class="card">
	<div class="card-image-container p-4">
		<enhanced:img src="../images/rauhankone.png" alt="Rauhankone Diagram" />
	</div>
	<p class="prose-2xl card-main-title">Layers in the Peace Machine</p>
	<p class="card-subtitle p-0">{subtitle}</p>

	{#if showForm}
		<input
			class="card-input-container card-input"
			type="text"
			placeholder="Enter something"
			bind:value={inputValue}
		/>
		<div class="card-btn">
			<button class="btn ml-2" on:click={() => onSubmit(inputValue)}>Submit</button>
		</div>
	{/if}

	{#if !showForm}
		<div class="card-btn">
			<button class="btn" on:click={toggleForm}>Take Part</button>
		</div>
	{/if}
</div>

<style>
	.card {
		max-width: 600px;
		max-height: 300px;
		border: none;
		border-radius: 20px;
		background-color: black;
		display: grid;
		grid-template-columns: 30% 1fr;
		grid-template-rows: repeat(4, 1fr);
		grid-template-areas:
			'image1 title'
			'image1 subtitle'
			'image1 input'
			'image1 button';
		padding: 1rem;
		box-sizing: border-box;
	}

	.card-image-container {
		grid-area: image1;
		height: 100%;
		object-fit: cover;
	}

	.card-main-title {
		grid-area: title;
	}

	.card-subtitle {
		grid-area: subtitle;
	}

	.card-input {
		grid-area: input;
	}

	.card-btn {
		grid-area: button;
		display: grid;
		align-items: center;
		justify-items: end;
	}

	.card-input-container {
		border: none;
	}
</style>
