<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { X } from 'lucide-svelte';
	import { playClusterSound, playBlip } from '$lib/composables/useAudio';
	import { blur } from 'svelte/transition';
	let { story = $bindable(), closeModal, onNavigateClosest, onNavigateFurthest } = $props();

	const idForDialog = crypto.randomUUID();
	// Handle click outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.id === idForDialog) {
			closeModal();
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="modal-story-container"
	role="dialog"
	in:blur={{ duration: 500 }}
	out:blur={{ duration: 500 }}
	id={idForDialog}
	tabindex="0"
	onclick={handleClickOutside}
	aria-modal="true"
	aria-label="Modal for story {story}"
>
<div class="modal-story-content">
	<div class="modal-story-header">
		<!-- <h1>{story.cluster_id}</h1> -->
		<button
		class="btn-close"
		onclick={(e) => {
			e.stopPropagation();
			playBlip();
			closeModal();
		}}
				>
				<X color="#ffffff" />
			</button>
		</div>
		<div class="modal-story-body">
				{#if story}
				<p>{story}</p>
				{/if}
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
		z-index: 10;
		top: 0;
		left: 0;
	}

	.modal-story-content {
		/* background-color: red; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--pad-5);
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
		margin-bottom: var(--pad-5);
		/* flex: 1; */
		overflow-y: auto;
		/* hyphens: auto; */
	}

	.modal-story-body::-webkit-scrollbar {
		width: 3px;
	}

	.modal-story-body::-webkit-scrollbar-thumb {
		background-color: rgba(112, 112, 112, 0.5);
		border-radius: 4px;
	}

	.modal-story-body p {
		font-family:
			Roboto Slab Regular,
			serif;
		margin: 0;
		text-align: left;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.modal-story-actions {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		/* padding: clamp(10px, 2vw, 20px); */
		flex-shrink: 0;
		gap: 10px;
		flex-wrap: nowrap;
	}

	.btn {
		white-space: nowrap;
		text-underline-offset: 3px;
		color: white;
		text-decoration: underline;
		font-weight: 200;
	}

	.btn-action {
		padding: 8px 10px 8px 10px;
		text-align: center;
		min-width: 80px;
		max-width: 100px;
		transform: translateX(-20px);
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
			position: absolute;
			top: 0;
			bottom: 0;
			right: auto;
			left: auto;
			min-height: 100%;
			max-height: 100vh;
			max-width: 85%;
			max-height: 70%;
			justify-content: flex-start;
			gap: 8px;
		}

		.modal-story-body {
			padding: 15px;
			max-height: 50vh;
		}

		.modal-story-actions {
			position: absolute;
			padding: 15px 15px 15px 15px;
			bottom: 8%;
			justify-content: flex-start;
		}
		.modal-story-header {
			min-height: 150px;
			align-items: flex-end;
		}

		.btn-close {
			position: unset;
			margin-right: 15px;
		}
	}

	@media (min-width: 768px) {
		.modal-story-content {
			max-width: 40%;
		}
	}
</style>
