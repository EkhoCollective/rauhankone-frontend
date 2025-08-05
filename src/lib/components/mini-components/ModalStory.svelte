<script lang="ts">
	let { story = $bindable(), closeModal } = $props();
</script>

<div class="modal-story-container">
	<div class="modal-story-content">
		<h1>{story.text}</h1>
		<button
			onclick={() => {
				closeModal();
				console.log('close');
			}}>Close</button
		>
	</div>
</div>

<style>
	.modal-story-container {
		/* background-color: black; */
		backdrop-filter: blur(10px);
		text-align: center;
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
</style>
