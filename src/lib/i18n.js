// import { browser } from '$app/environment';
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('$lib/translations/en.json'));
/* register('en-GB', () => import('$lib/translations/en.json'));
register('fi-FI', () => import('$lib/translations/fi.json')); */
register('fi', () => import('$lib/translations/fi.json'));

//register('sv', () => import('$lib/translations/sv.json'));
//register('sa', () => import('$lib/translations/sa.json'));

const supportedLocales = ['en', 'fi', 'en-GB'];

const getLocaleFromNavigatorSafe = () => {
	const locale = getLocaleFromNavigator()?.slice(0, 2) || defaultLocale;
	return supportedLocales.includes(locale) ? locale : defaultLocale;
}

init({
	initialLocale: getLocaleFromNavigatorSafe(),
	fallbackLocale: defaultLocale
});
