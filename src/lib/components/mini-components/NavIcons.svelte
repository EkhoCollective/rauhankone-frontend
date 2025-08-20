<script lang="ts">
	import { ArrowLeft, ArrowRight, SquarePlus, SquareMinus } from 'lucide-svelte';
	import { soundEffects } from '$lib/utils/soundEffects';

	let {
		value = $bindable(),
		isMobileDevice = false,
		isInContinuousPress = false,
		onTouchStart,
		onTouchEnd
	} = $props();

	function handleNavButton(button: string) {
		value = button;
	}

	function playUISound() {
		soundEffects.playEffect('Blip_UI');
	}

	function handleTouchStart(button: string) {
		playUISound();
		onTouchStart?.(button);
	}

	function handleTouchEnd() {
		onTouchEnd?.();
	}

	function handleClick(button: string) {
		// Only handle click events if not currently in continuous press mode
		if (!isInContinuousPress) {
			playUISound();
			handleNavButton(button);
		}
	}
</script>

<div class="map-navigation-icons-container">
	<div>
		<button
			class="icon-left-btn btn-container map-nav-button"
			onclick={() => handleClick('left')}
			onmousedown={(e) => {
				e.preventDefault();
				handleTouchStart('left');
			}}
			onmouseup={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			onmouseleave={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			ontouchstart={(e) => {
				e.preventDefault();
				handleTouchStart('left');
			}}
			ontouchend={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
		>
			<ArrowLeft color="#ffffff" />
		</button>
	</div>
	<div class="sub-container">
		<button
			class="icon-plus-btn btn-container map-nav-button"
			onclick={() => handleClick('plus')}
			onmousedown={(e) => {
				e.preventDefault();
				handleTouchStart('plus');
			}}
			onmouseup={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			onmouseleave={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			ontouchstart={(e) => {
				e.preventDefault();
				handleTouchStart('plus');
			}}
			ontouchend={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
		>
			<SquarePlus color="#ffffff" />
		</button>
		<button
			class="icon-minus-btn btn-container map-nav-button"
			onclick={() => handleClick('minus')}
			onmousedown={(e) => {
				e.preventDefault();
				handleTouchStart('minus');
			}}
			onmouseup={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			onmouseleave={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			ontouchstart={(e) => {
				e.preventDefault();
				handleTouchStart('minus');
			}}
			ontouchend={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
		>
			<SquareMinus color="#ffffff" />
		</button>
	</div>
	<div>
		<button
			class="icon-right-btn btn-container map-nav-button"
			onclick={() => handleClick('right')}
			onmousedown={(e) => {
				e.preventDefault();
				handleTouchStart('right');
			}}
			onmouseup={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			onmouseleave={(e) => {
				e.preventDefault();
				handleTouchEnd();
			}}
			ontouchstart={(e) => {
				e.preventDefault();
				handleTouchStart('right');
			}}
			ontouchend={(e) => {
				e.preventDefault();
				handleTouchEnd();
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
		padding: 5px 5px 5px 5px;
	}
</style>
