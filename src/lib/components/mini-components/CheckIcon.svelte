<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { useAudio } from '$lib/composables/useAudio';
  import checkIconStyles from './CheckIcon.module.scss';

  

	const { playBlip } = useAudio();

	function playUISound() {
		playBlip();
	}

	let { checkValue = $bindable(false), translateIdForCheckbox, hideLabel } = $props();

	function handleCheckmark() {
		console.debug("Checkbox clicked");
		checkValue = !checkValue;
	}
</script>

<div class={checkIconStyles['check-icon-container']}>
  <input 
  type="checkbox"
  data-checked={checkValue}
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
</div>

<style>
</style>
