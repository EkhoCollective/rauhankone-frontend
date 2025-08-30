<script lang="ts">
	import { _ } from 'svelte-i18n';
	let {
		textValue = $bindable(),
		minHeight,
		labelId,
		name,
		debounceTime = 750,
		typingActive = $bindable(false)
	} = $props();

	let timer: number | null = null;

	const debounce = () => {
		typingActive = true;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			typingActive = false;
		}, debounceTime);
	};
</script>

<div class="container">
	<!-- <pre aria-hidden="true" style="min-height: {minHeight}">{textValue + '\n'}</pre> -->
	<textarea onkeydown={debounce} bind:value={textValue} placeholder={$_('submit_input_placeholder')} name={labelId}></textarea>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		min-width: 100%;
		min-height: 100%;
	}

	textarea {
		font-family: inherit;
		line-height: 1.2;
		
		border-radius: unset;
		padding: 0.5em;
		
		border: none;
		outline: 1px solid rgb(126, 126, 126);
		transition: outline 0.1s ease-in-out;
		
		overflow-y: scroll;
		overflow-x: hidden;
		resize: none;
		
		background-color: black;
		color: white;
		
		height: 100%;
		min-height: 200px;
		max-height: 300px;
		width: 100%;
		
	}

	textarea::placeholder {
		color: #a0a0a0;
	}
	textarea:focus,
	textarea:focus-within {
		border-radius: unset;
		outline: 1px solid rgb(255, 255, 255);
		outline-offset: unset;
		transition: outline 0.1s ease-in-out;
	}
</style>
