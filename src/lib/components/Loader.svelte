<!-- Loading Animation-->

<div class="loader-container">
	<div class="loader"></div>
</div>

<style>
	:root {
		--loader-color: white;
		--loader-background: black;
		--pulse-size: 80px;
		--pulse-timing: 1.5s;
	}

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

	.loader-container {
		background-color: var(--loader-background);
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
	}
</style>
