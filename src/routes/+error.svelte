<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';

	const reloadPage = () => {
		window.history.go(-1); // Go back
	};
	/* http://localhost:5173/error?message=Hi */
	
	/* We'll see if this is a 'fools 404' as in we're passing params in the url
	because svelte won't trigger the error template otherwise
	*/
	let pathParams = new URLSearchParams(window.location.search);
	let errorMessage = pathParams.get('message');
	let errorCode = pathParams.get('code');
	let finalError;
	
	if (!page.error?.message) {
		finalError = {
			message: errorMessage || 'An unexpected error occurred',
			status: errorCode || 500
		}
	} else {
		finalError = {
			message: errorMessage || 'An unexpected error occurred',
			status: errorCode || 500
		};
	}

</script>

<div class="loader-container" in:fly={{ duration: 100 }}>
	<div class="error-container">
		<h1>{finalError.message || 'An error occurred'}</h1>
		<p>{finalError.status}</p>
	</div>
	<div class="button-container">
		<button  data-variant="primary" onclick={() => goto('/')}>{$_('error_btn_home')}</button>
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
		height: 100%;
		margin: 0;
		margin-left: auto;
		margin-right: auto;
	}

	.error-container {
		color: #ffbcbc;
		max-width: 75%;
		margin-left: auto;
		margin-right: auto;
	}

	.button-container {
		margin-top: 50px;
		margin-left: auto;
		margin-right: auto;
	}


</style>
