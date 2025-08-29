<script>
	import Loader from '$lib/components/mini-components/Loader.svelte';
</script>

<div class="loader-container">
	<Loader color="white" pulseSize="80px" pulseTiming="1.5s" />
</div>

<style>
	.loader-container {
		background-color: black;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		margin: 0;
	}
</style>
