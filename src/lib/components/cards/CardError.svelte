<script>
	import { _ } from 'svelte-i18n';

	let { errorMessage } = $props();

	const toHome = () => {
		window.location.reload();
	};
</script>

<div class="loader-container">
	<div class="error-container">
		<h1>{errorMessage}</h1>
	</div>
	<div class="button-container">
		<button class="btn btn-home" onclick={() => toHome()}>{$_('btn_home')}</button>
	</div>
</div>

<style>
	.loader-container {
		background-color: black;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
	}

	.error-container {
		color: #ffbcbc;
		max-width: 75%;
	}

	.button-container {
		margin-top: 200px;
	}

	.btn-home {
		background-color: black;
		border: none;
		box-shadow: none;
		width: 100%;
		font-size: 16px;
		text-decoration: underline;
		border-radius: 0px;
		color: white;
	}
</style>
