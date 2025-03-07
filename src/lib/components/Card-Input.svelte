<script>
	export let title = 'Card Title';
	export let subtitle = 'Card Subtitle';
	export let btnText = 'Card Button Text';
</script>

<div class="card">
	<div class="card-image-container p-4">
		<enhanced:img src="../images/rauhankone.png" alt="Rauhankone Diagram" />
	</div>
	<p class="prose-2xl card-main-title">{title}</p>
	<p class="card-subtitle p-8">{subtitle}</p>
	<div class="card-btn">
		<button class="btn">{btnText}</button>
	</div>
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
		grid-template-rows: repeat(3, 1fr);
		grid-template-areas:
			'image1 title'
			'image1 subtitle'
			'image1 button';
		/* justify-content: space-around; */
		/* align-items: start; */
		padding: 1rem;
		box-sizing: border-box;
	}

	.card-image-container {
		grid-area: image1;
		/* width: 100%; */
		height: 100%;
		object-fit: cover;
	}

	.card-main-title {
		grid-area: title;
	}

	.card-subtitle {
		grid-area: subtitle;
	}

	.card-btn {
		grid-area: button;
		display: grid;
		align-items: center;
		justify-items: end;
	}
</style>
