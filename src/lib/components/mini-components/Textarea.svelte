<script lang="ts">
	import { _ } from 'svelte-i18n';
	let {
		textValue = $bindable(),
		minHeight,
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
	<pre aria-hidden="true" style="min-height: {minHeight}">{textValue + '\n'}</pre>
	<textarea onkeydown={debounce} bind:value={textValue} placeholder={$_('input_placeholder')}
	></textarea>
</div>

<style>
	.container {
		position: relative;
		border: 0px solid black;
	}
	pre,
	textarea {
		font-family: inherit;
		padding: 0.5em;
		box-sizing: border-box;
		outline: none;
		border: 0px solid black;
		line-height: 1.2;
		overflow: hidden;
		color: #a0a0a0;
		background-color: black;
	}
	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
		background-color: black;
	}
	.container:has(textarea:focus) {
		outline: none;
		border: 0px solid black;
		background-color: black;
	}
</style>
