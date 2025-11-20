<script lang="ts">
	import { _ } from 'svelte-i18n';
	import logoFin from '../media/Oulu2026_logo_white_RGB_FIN_horizontal.png'; // 640 × 240
	import logoEng from '../media/Oulu2026_logo_white_RGB_FIN_horizontal.png'; // 640 × 259


	const locale = sessionStorage.getItem('locale') || 'en';
	// Set correct logo based on locale
	const logo = locale === 'fi' ? logoFin : logoEng;

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
	<div class="logocontainer">
		<img src={logo} alt="Oulu 2026 Logo" class="footer-logo" />
	</div>
</footer>

<style>
	.footer-container {
		padding-top: 50px;
		display: flex;
		flex-direction: column;
		text-decoration: unset;
	}

	.logocontainer {
		width: 200px;
		height: 100%;
		transform: translateX(-17px);
	}
	.footer-logo {
		width: 100%;
		height: 100%;
	}

		@media (max-width: 768px) {
		.footer-container {
			padding-top: var(--pad-4);
		}
	}
</style>
