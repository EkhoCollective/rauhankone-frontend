<script lang="ts">
	import { ArrowLeft, ArrowRight, SquarePlus, SquareMinus } from 'lucide-svelte';
	import { soundEffects } from '$lib/utils/soundEffects';
	let { value = $bindable() } = $props();

	function handleNavButton(button: string) {
		value = button;
	}

	function playUISound() {
		soundEffects.playEffect('Blip_UI');
	}
</script>

<div class="map-navigation-icons-container">
	<div>
		<button
			class="icon-left-btn btn-container map-nav-button"
			onclick={() => {
				playUISound();
				handleNavButton('left');
			}}
		>
			<ArrowLeft color="#ffffff" />
		</button>
	</div>
	<div class="sub-container">
		<button
			class="icon-plus-btn btn-container map-nav-button"
			onclick={() => {
				playUISound();
				handleNavButton('plus');
			}}
		>
			<SquarePlus color="#ffffff" />
		</button>
		<button
			class="icon-minus-btn btn-container map-nav-button"
			onclick={() => {
				playUISound();
				handleNavButton('minus');
			}}
		>
			<SquareMinus color="#ffffff" />
		</button>
	</div>
	<div>
		<button
			class="icon-right-btn btn-container map-nav-button"
			onclick={() => {
				playUISound();
				handleNavButton('right');
			}}
		>
			<ArrowRight color="#ffffff" />
		</button>
	</div>
</div>

<style>
	.map-navigation-icons-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}

	.sub-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.btn-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
