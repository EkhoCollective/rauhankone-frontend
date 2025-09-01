<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<!-- Footer -->
<footer class="footer-container">
	<div>
		<a href={$_('main_link_rk')} target="_blank" rel="noopener noreferrer">{$_('main_title')}</a>
	</div>
	<div>
		<a href={$_('main_link_oulu')} target="_blank" rel="noopener noreferrer">Oulu 2026</a>
	</div>
	<div>
		<a href={$_('main_link_ekho')} target="_blank" rel="noopener noreferrer">© Ekho Collective</a>
	</div>
	<div><a href={$_('main_link_gdpr')} target="_blank" rel="noopener noreferrer">{$_('main_link_gdpr_title')}</a></div>
</footer>

<style>
	.footer-container {
		padding-top: 50px;
		display: flex;
		flex-direction: column;
		text-decoration: unset;
	}

		@media (max-width: 768px) {
		.footer-container {
			padding-top: var(--pad-4);
		}
	}
</style>
