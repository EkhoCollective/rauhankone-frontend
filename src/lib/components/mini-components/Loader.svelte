<!-- Loading Animation-->

<script>
	let { color, pulseSize, pulseTiming } = $props();
</script>

<div
	class="loader"
	style="--loader-color: {color}; --pulse-size: {pulseSize}; --pulse-timing: {pulseTiming}"
></div>

<style>
	.loader {
		width: var(--pulse-size);
		height: var(--pulse-size);
		border-radius: var(--pulse-size);
		background-color: var(--loader-color);
		outline: 1px solid transparent;
		animation: pulseanim var(--pulse-timing) ease-in-out infinite;
	}

	@keyframes pulseanim {
		0% {
			transform: scale(0);
			opacity: 0.8;
		}
		100% {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>
