<script>
	import { _ } from 'svelte-i18n';
	let { textValue = $bindable(), minHeight } = $props();
</script>

<div class="container">
	<pre aria-hidden="true" style="min-height: {minHeight}">{textValue + '\n'}</pre>
	<textarea bind:value={textValue} placeholder={$_('input_placeholder')}></textarea>
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
		color: white;
		background-color: rgb(10, 10, 10);
	}
	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
		background-color: rgb(10, 10, 10);
	}
	.container:has(textarea:focus) {
		outline: none;
		border: 0px solid black;
		background-color: rgb(30, 30, 30);
	}
</style>
