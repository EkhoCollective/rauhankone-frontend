<script lang="ts">
	import { _ } from 'svelte-i18n';

	let { checkValue = $bindable(false), translateIdForCheckbox } = $props();

	function handleCheckmark() {
		console.debug("Checkbox clicked");
		checkValue = !checkValue;
	}
</script>
<!-- bind:checked={checkValue} -->

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
		}
	}}
	/>

	<label for={`${translateIdForCheckbox}-id`}>{$_(translateIdForCheckbox)}</label>
</div>

<style>

:root {
	--checkbox-color: #ffffff;
	--checkbox-bg-color: #000000;
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
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  transform: translateY(-0.075em);
    display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--checkbox-color);
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

</style>
