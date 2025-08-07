<script lang="ts">
	import { X } from 'lucide-svelte';
	let { story = $bindable(), closeModal } = $props();
</script>

<div class="modal-story-container">
	<div class="modal-story-content">
		<div class="modal-story-header">
			<!-- <h1>{story.cluster_id}</h1> -->
			<button class="btn btn-close" onclick={() => closeModal()}><X color="#ffffff" /></button>
		</div>
		<div class="modal-story-body">
			<h1>{story.text}</h1>
		</div>

		<div class="modal-story-actions">
			<button class="btn btn-action"> Closest</button>
			<button class="btn btn-action"> Farthest</button>
			<!-- <button class="btn btn-action"> Random</button> -->
		</div>
	</div>
</div>

<style>
	.modal-story-container {
		/* background-color: black; */
		/* backdrop-filter: blur(10px); */
		/* text-align: center; */
		display: flex;
		justify-content: center;
		align-items: center;
		/* height: 100vh; */
		/* margin: 0; */
		width: 100vw;
		height: 100vh;
		/* background-color: black; */
		/* display: grid; */
		/* grid-template-rows: 50px 1fr 25%; */
	}

	.modal-story-content {
		/* background-color: red; */
		display: flex;
		flex-direction: column;
		min-height: 200px;
		/* min-width: 90%; */
		max-width: 90%;
	}

	.modal-story-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 10px 0 0 20px;
	}

	.modal-story-body {
		padding: 20px;
	}

	.modal-story-actions {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
	}

	.btn-close {
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}

	.btn {
		height: 100%;
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}

	@media (min-width: 768px) {
		.modal-story-content {
			max-width: 40%;
		}
	}
</style>
