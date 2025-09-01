<script lang="ts">
	import { _ } from 'svelte-i18n';
	import textAreaStyles from './Textarea.module.scss';
	let {
		textValue = $bindable(),
		minHeight,
		labelId,
		name,
		debounceTime = 750,
		typingActive = $bindable(false)
	} = $props();

	let timer: number | null = null;
	let textareaEl: HTMLTextAreaElement | null = null;

	const debounce = () => {
		typingActive = true;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			typingActive = false;
		}, debounceTime);
	};
</script>

<div class={`${textAreaStyles['input-sizer']} ${textAreaStyles['stacked']}`}>
	<!-- <pre aria-hidden="true" style="min-height: {minHeight}">{textValue + '\n'}</pre> -->
	<textarea
	bind:this={textareaEl}
	oninput={() => {
		if (textareaEl) {
			// Set the data-value attribute to the current value for styling purposes
			textareaEl.parentElement?.setAttribute('data-value', textareaEl.value + '\n');
		}
	}}
	onkeydown={debounce} 
	bind:value={textValue} 
	placeholder={$_('submit_input_placeholder')} 
	name={labelId}></textarea>
</div>

<style>
/* 	.container {
		display: flex;
		flex-direction: column;
		min-width: 100%;
		min-height: 100%;
	} */

	textarea {
		min-width: 100%;
		min-height: 100px;
		font-family: 'Roboto Slab Regular', serif;
		line-height: 1.2;
		border-radius: unset;
		padding: 0.5em;
		font-size: 16px;
		border: none;
		border-radius: 1.4px;
		outline: 1px solid rgb(126, 126, 126);
		transition: outline 0.1s ease-in-out;
		
		overflow-y: scroll;
		overflow-x: hidden;
		
		background-color: black;
		color: white;
		
		height: auto;
		width: 100%;
		
	} 

	textarea {
		color: white;
		min-height: 100px;
		min-width: 100%;
	}

	textarea::placeholder {
		color: #a0a0a0;
	}
	textarea:focus,
	textarea:focus-within {
		border-radius: 1.4px;
		outline: 1px solid rgb(255, 255, 255);
		outline-offset: unset;
		transition: outline 0.1s ease-in-out;
	}
</style>
