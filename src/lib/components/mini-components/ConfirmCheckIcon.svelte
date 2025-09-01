<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { useAudio } from '$lib/composables/useAudio';
	import { blur } from 'svelte/transition';

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

<style>

:root {
	--checkbox-color: #ffffff;
	--checkbox-bg-color: #000000;
}

input[type="checkbox"] + label {
  transform: translateY(-2px);

}

label {
  font-weight: 300;
  max-width: 70ch;
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
  width: 1.15rem;
  height: 1.15rem;
  aspect-ratio: 1;
  border: 1px solid white;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  position: relative;
}

input[type="checkbox"]::before {
  content: "✓";
  position: absolute;
  line-height: 0;
  text-shadow: 
    0 0 1px var(--checkbox-bg-color),
    0 0 1px var(--checkbox-bg-color),
    1px 1px 1px var(--checkbox-bg-color),
    -1px -1px 1px var(--checkbox-bg-color);
  
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  top: 60%;
  left: 5%;
  right: auto;
  bottom: auto;
  transition: 60ms transform ease-in-out;
}

input[type="checkbox"]:checked::before {
  transform: scale(1.6) translateX(0.2em)
}

.checkmark-container {
  display: grid;
  grid-template-areas: 
    "checkbox label"
    "checkbox button";
  gap: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
}

.checkmark-container label {
  grid-area: label;
}

.checkmark-container input[type="checkbox"] {
  grid-area: checkbox;
}

.disclaimer-btn-container {
  grid-area: button;
  margin-top: 1rem;
}


	@media (max-width: 768px) {
    .checkmark-container {
      grid-template-areas: 
        "checkbox   label"
        ".          button";
      gap: 0.5rem;
    }

    .disclaimer-btn-container {
      margin-left: auto;
      margin-right: 0;
    }
  }

</style>
