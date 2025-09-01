<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { X } from 'lucide-svelte';
	import { playClusterSound, playBlip } from '$lib/composables/useAudio';
	let { story = $bindable(), closeModal, onNavigateClosest, onNavigateFurthest } = $props();
</script>

<div class="modal-story-container">
	<div class="modal-story-content">
		<div class="modal-story-header">
			<!-- <h1>{story.cluster_id}</h1> -->
			<button
				class="btn btn-corner"
				onclick={() => {
					playBlip();
					closeModal();
				}}
			>
				<X color="#ffffff" />
			</button>
		</div>
		<div class="modal-story-body">
		<p>{story}</p>
		</div>

		<div class="modal-story-actions">
			<button
				class="btn btn-action"
				onclick={() => {
					playClusterSound();
					onNavigateClosest && onNavigateClosest();
				}}
			>
				{$_('explore_modal_btn_closest')}
			</button>
			<button
				class="btn btn-action"
				onclick={() => {
					playClusterSound();
					onNavigateFurthest && onNavigateFurthest();
				}}
			>
				{$_('explore_modal_btn_furthest')}
			</button>
		</div>
	</div>
</div>

<style>
	.modal-story-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.modal-story-content {
		/* background-color: red; */
		display: flex;
		flex-direction: column;
		/* min-height: 200px; */
		height: 50%;
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

	.modal-story-body p {
		margin: 0;
		text-align: center;
		line-height: 1.4;
		white-space: pre-wrap;
		overflow-wrap: break-word;
	}

	.modal-story-actions {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: clamp(10px, 2vw, 20px);
		flex-shrink: 0;
		gap: 10px;
		flex-wrap: nowrap;
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
			max-height: 85%;
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
