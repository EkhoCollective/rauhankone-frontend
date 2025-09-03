
<script lang="ts">
import { _ } from 'svelte-i18n';
import textAreaStyles from './Textarea.module.scss';
import { onMount } from 'svelte';
let {
	textValue = $bindable(),
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

function isMobile() {
	// Basic mobile detection
	let maxWidth = 768;
	return typeof window !== 'undefined' && window.innerWidth <= maxWidth;
}

function scrollTextareaIntoView() {
	if (!textareaEl || !isMobile()) return;
	// Get the bounding rect of the textarea
	const rect = textareaEl.getBoundingClientRect();
	// Calculate the scroll position so the textarea is near the top (with a small offset)
	/* const offset = 160; // px from top
	const scrollY = window.scrollY + rect.top - offset; */
	window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<div class={`${textAreaStyles['input-sizer']} ${textAreaStyles['stacked']}`}>
	<!-- <pre aria-hidden="true" style="min-height: {minHeight}">{textValue + '\n'}</pre> -->
	<textarea
		bind:this={textareaEl}
		oninput={() => {
			if (textareaEl) {
				// Set the data-value attribute to the current value for styling purposes
				if (isMobile()) {
					return;

				}
				textareaEl.parentElement?.setAttribute('data-value', textareaEl.value + '\n');
			}
			scrollTextareaIntoView();
		}}
		onkeydown={debounce}
		onfocus={() => scrollTextareaIntoView()}
		bind:value={textValue}
		placeholder={$_('submit_input_placeholder')}
		name={labelId}
	></textarea>
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
		font-family: 'Roboto Slab Regular', serif;
		line-height: 1.2;
		border-radius: unset;
		padding: var(--pad-3);
		font-size: var(--f18);
		border: none;
		border-radius: var(--pad-1);
		transition: outline 0.1s ease-in-out;
		
		overflow-y: scroll;
		overflow-x: hidden;
		
		color: white;
		
		height: auto;
		max-width: 100%;

		background-color: var(--bg-gray);
	} 


	textarea::placeholder {
		color: #a0a0a0;
	}
	textarea:focus,
	textarea:focus-within {
        border: none;
		outline-offset: 0;
		outline: 1px solid rgb(226, 226, 226);
		border-radius: var(--pad-1);
		/* outline: unset;
		outline-offset: unset;
		outline: 1px solid rgb(126, 126, 126); */
		/* transition: outline 0.2s ease-in-out; */
		/* outline: 1px solid rgb(255, 255, 255); */
	}
</style>
