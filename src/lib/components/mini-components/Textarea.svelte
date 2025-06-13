<script>
	// export let value = '';
	// export let minRows = 1;
	// export let maxRows;

	// $: minHeight = `${1 + minRows * 1.2}em`;
	// $: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`;

	let { textValue, minHeight } = $props();
</script>

<div class="container">
	<pre aria-hidden="true" style="min-height: {minHeight}">{textValue + '\n'}</pre>
	<textarea bind:value={textValue}></textarea>
</div>

<style>
	.container {
		position: relative;
	}

	pre,
	textarea {
		font-family: inherit;
		padding: 0.5em;
		box-sizing: border-box;
		border: 1px solid #eee;
		line-height: 1.2;
		overflow: hidden;
		color: white;
	}

	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}

	.container:has(textarea:focus) {
		background-color: rgb(30, 30, 30);
	}
</style>
