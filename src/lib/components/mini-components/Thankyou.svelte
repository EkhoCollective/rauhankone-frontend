<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<div class="thankyou-container">
	<h1>{$_('submit_toast')}</h1>
</div>

<style>
	.thankyou-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
