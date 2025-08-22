<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<!-- Footer -->
<div class="footer-container">
	<div>
		<a href={$_('main_link_rk')} target="_blank">{$_('main_title')}</a>
	</div>
	<div>
		<a href={$_('main_link_oulu')} target="_blank">Oulu 2026</a>
	</div>
	<div>
		<a href={$_('main_link_ekho')} target="_blank">© Ekho Collective</a>
	</div>
	<div><a href={$_('main_link_gdpr')} target="_blank">{$_('main_link_gdpr_title')}</a></div>
</div>

<style>
	.footer-container {
		display: flex;
		flex-direction: column;
		text-decoration: underline;
	}
</style>
