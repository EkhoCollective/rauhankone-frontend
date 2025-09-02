<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { useAudio } from '$lib/composables/useAudio';
	import { blur } from 'svelte/transition';
  import checkIconStyles from './ConfirmCheckIcon.module.scss';

	const { playBlip, playtoMap } = useAudio();

	function playUISound() {
		playBlip();
	}

	let { checkValue = $bindable(false), translateIdForCheckbox, hideLabel, handleSubmit } = $props();

	function handleCheckmark() {
		console.debug("Checkbox clicked");
		checkValue = !checkValue;
	}
</script>

<div class={checkIconStyles['check-icon-container']}>
	<input 
	type="checkbox"
	checked={checkValue}
	id={`${translateIdForCheckbox}-id`}
	name={$_(translateIdForCheckbox)}
	onchange={handleCheckmark}
	onkeypress={(e) => {
		if (e.key === 'Enter') {
			handleCheckmark();
			playUISound();
		}
	}}
	aria-label={$_(translateIdForCheckbox)}
	/>
	{#if !hideLabel}
		<label for={`${translateIdForCheckbox}-id`}>{$_(translateIdForCheckbox)}</label>
	{/if}
  	<div transition:blur class="disclaimer-btn-container">
				<div>
					<button
						disabled={!checkValue}
						data-variant="primary"
						onclick={() => {
							playtoMap();
							handleSubmit();
						}}>{$_('submit_btn_submit')}</button
					>
				</div>
			</div>
</div>


