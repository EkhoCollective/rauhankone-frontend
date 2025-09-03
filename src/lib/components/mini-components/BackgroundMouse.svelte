<script lang="ts">
	import { Spring } from 'svelte/motion';

	let { maxMovement = 100, stiffness = 0.05, damping = 0.95, bgImage = $bindable() } = $props();

	let coords = new Spring(
		{ x: 0, y: 0 },
		{
			stiffness,
			damping
		}
	);

	export function updateCoords(e: MouseEvent) {
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		// Calculate distance from center, normalized to -1 to 1
		const normalizedX = (e.clientX - centerX) / centerX;
		const normalizedY = (e.clientY - centerY) / centerY;

		// Scale to desired movement range
		coords.target = {
			x: normalizedX * maxMovement,
			y: normalizedY * maxMovement
		};
	}

	console.log('bgImage', bgImage);
	$inspect(coords);
</script>

<div class="bg-container">
	<div
		class="bg-mouse"
		style="--x: {-coords.current.x}px; --y: {-coords.current
			.y}px; background-image: url('{bgImage}');"
		role="presentation"
	></div>
</div>

<style>
	.bg-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.bg-mouse {
		--x: 0px;
		--y: 0px;
		width: 110%;
		height: 110%;
		/* background-image: url('../media/images/EKHO_Sketch_bg.webp'); */
		background-position: var(--x) var(--y);
		background-size: cover;
		background-repeat: no-repeat;
		overflow: hidden;
		filter: blur(10px);
	}
</style>
