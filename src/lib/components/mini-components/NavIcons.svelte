<script lang="ts">
	import { ArrowLeft, ArrowRight, SquarePlus, SquareMinus } from 'lucide-svelte';

	let { value = $bindable() } = $props();

	function handleNavButton(button: string) {
		value = button;
	}
</script>

<div class="map-navigation-icons-container">
	<div>
		<button class="icon-left-btn btn-container map-nav-button" onclick={() => handleNavButton('left')}>
			<ArrowLeft color="#ffffff" />
		</button>
	</div>
	<div class="sub-container">
		<button class="icon-plus-btn btn-container map-nav-button" onclick={() => handleNavButton('plus')}>
			<SquarePlus color="#ffffff" />
		</button>
		<button class="icon-minus-btn btn-container map-nav-button" onclick={() => handleNavButton('minus')}>
			<SquareMinus color="#ffffff" />
		</button>
	</div>
	<div>
		<button class="icon-right-btn btn-container map-nav-button" onclick={() => handleNavButton('right')}>
			<ArrowRight color="#ffffff" />
		</button>
	</div>
</div>

<style>
	.map-navigation-icons-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.sub-container {
		display: flex;
		flex-direction: column;
	}

	.btn-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
