// import { browser } from '$app/environment';
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('$lib/translations/en.json'));
register('en-GB', () => import('$lib/translations/en.json'));

register('fi', () => import('$lib/translations/fi.json'));
register('sv', () => import('$lib/translations/sv.json'));
register('sa', () => import('$lib/translations/sa.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: getLocaleFromNavigator() || defaultLocale
});
