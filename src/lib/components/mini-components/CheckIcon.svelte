<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { useAudio } from '$lib/composables/useAudio';

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

<div class="checkmark-container">
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
</div>

<style>

:root {
	--checkbox-color: #ffffff;
	--checkbox-bg-color: #000000;
}

input[type="checkbox"] + label {
  transform: translateY(-2px);

}
	  
input[type="checkbox"] {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  appearance: none;
  /* For iOS < 15 to remove gradient background */
  background-color: var(--checkbox-bg-color);
  /* Not removed via appearance */
  margin: 0;

  font: inherit;
  color: white;
  width: 1.15em;
  height: 1.15em;
  border: 1px solid white;
  border-radius: 2px;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  position: relative;
}

input[type="checkbox"]::before {
  content: "✓";
  position: absolute;
  line-height: 0;

  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  top: 50%;
  left: 12%;
  right: auto;
  bottom: auto;
  transition: 60ms transform ease-in-out;
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.checkmark-container {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

</style>
