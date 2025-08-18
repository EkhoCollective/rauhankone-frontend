<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	let { story = $bindable(), closeModal, onNavigateClosest, onNavigateFurthest } = $props();
</script>

<div class="modal-story-container">
	<div class="modal-story-content">
		<div class="modal-story-header">
			<!-- <h1>{story.cluster_id}</h1> -->
			<button class="btn btn-close" onclick={() => closeModal()}><X color="#ffffff" /></button>
		</div>
		<div class="modal-story-body">
			<h1>{story}</h1>
		</div>

		<div class="modal-story-actions">
			<button class="btn btn-action" onclick={() => onNavigateClosest && onNavigateClosest()}>
				{$_('explore_modal_btn_closest')}</button
			>
			<button class="btn btn-action" onclick={() => onNavigateFurthest && onNavigateFurthest()}>
				{$_('explore_modal_btn_furthest')}</button
			>
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
		/* min-height: 200px; */
		height: 50vh;
		/* min-width: 90%; */
		width: 100%;
		overflow: hidden;
	}

	.modal-story-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 10px 0 0 20px;
	}

	.modal-story-body {
		padding: 20px;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		word-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}

	.modal-story-body h1 {
		margin: 0;
		line-height: 1.4;
		white-space: pre-wrap;
		overflow-wrap: break-word;
	}

	.modal-story-actions {
		display: flex;
		justify-content: end;
		align-items: center;
		padding: 20px;
		flex-shrink: 0;
		gap: 15px;
		flex-wrap: wrap;
	}

	.btn-close {
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}

	.btn {
		background-color: transparent;
		border-radius: 0;
		border: none;
		box-shadow: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
		text-decoration: underline;
		text-underline-offset: 2px;
		color: white;
	}

	.btn-action {
		padding: 8px 16px;
		min-width: 80px;
		max-width: 150px;
	}

	/* .btn-explore {
		background-color: black;
		border-color: none;
		border: none;
		box-shadow: none;
		width: 100%;
		font-size: 16px;
		text-decoration: underline;
		text-underline-offset: 2px;
		border-radius: 0px;
		color: white;
	} */

	@media (max-width: 767px) {
		.modal-story-content {
			max-width: 95%;
			max-height: 85vh;
		}

		.modal-story-body {
			padding: 15px;
		}

		.modal-story-actions {
			padding: 15px;
		}
	}

	@media (min-width: 768px) {
		.modal-story-content {
			max-width: 40%;
		}
	}
</style>
