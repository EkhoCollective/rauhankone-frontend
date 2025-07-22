<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<!-- Footer -->
<div class="footer-container">
	<div>
		<a href={$_('rk_link')} target="_blank">{$_('rk_title')}</a>
	</div>
	<div>
		<a href={$_('oulu_link')} target="_blank">Oulu 2026</a>
	</div>
	<div>
		<a href={$_('ekho_link')} target="_blank">© Ekho Collective</a>
	</div>
	<div><a href={$_('gdpr_link')} target="_blank">GDPR</a></div>
</div>

<style>
	.footer-container {
		display: flex;
		flex-direction: column;
		text-decoration: underline;
	}
</style>
