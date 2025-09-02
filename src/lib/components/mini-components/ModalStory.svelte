<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { X } from 'lucide-svelte';
	import { playClusterSound, playBlip } from '$lib/composables/useAudio';
	let { story = $bindable(), closeModal, onNavigateClosest, onNavigateFurthest } = $props();
</script>

<div class="modal-story-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
	<div class="modal-story-content">
		<div class="modal-story-header">
			<!-- <h1>{story.cluster_id}</h1> -->
			<button
				class="btn-close"
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
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(10px);
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 100;
		top: 0;
		left: 0;
	}

	.modal-story-content {
		/* background-color: red; */
		display: flex;
		flex-direction: column;
		/* min-height: 200px; */
		height: 90%;
		max-height: 90%;
		width: 100%;
	}

	.modal-story-header {
		position: relative;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 10px 0 0 20px;
		min-height: 50px;
	}

	.modal-story-body {
		padding: 10px;
		flex: 1;
		overflow-y: auto;
		word-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}

	.modal-story-body::-webkit-scrollbar {
		width: 3px;
	}

	.modal-story-body::-webkit-scrollbar-thumb {
		background-color: rgba(112, 112, 112, 0.5);
		border-radius: 4px;
	}

	.modal-story-body p {
		font-family: Roboto Slab Regular, serif;
		margin: 0;
		text-align: left;
		line-height: 1.5;
		white-space: pre-wrap;
  		word-break: break-word;
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
		white-space: nowrap;
		text-underline-offset: 3px;
		color: white;
	}

	.btn:hover {
		text-decoration: underline;
	}

	.btn-action {
		padding: 8px 16px;
		min-width: 80px;
		max-width: 150px;
	}

	.btn-close {
		position: absolute;
		top: 0px;
		right: -10px;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}



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

		.btn-close {
			left: 50%;
			right: unset;
			right: 50%;
		}
	}

	@media (min-width: 768px) {
		.modal-story-content {
			max-width: 40%;
		}
	}
</style>
