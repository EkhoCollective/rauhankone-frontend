<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<!-- Footer -->
<div class="footer-container">
	<a href={$_('rk_link')} target="_blank">{$_('rk_title')}</a>
	<a href={$_('oulu_link')} target="_blank">Oulu 2026</a>
	<a href={$_('ekho_link')} target="_blank">© Ekho Collective</a>
	<a href={$_('gdpr_link')} target="_blank">GDPR</a>
</div>

<style>
	.footer-container {
		display: flex;
		flex-direction: column;
		text-decoration: underline;
	}
</style>
