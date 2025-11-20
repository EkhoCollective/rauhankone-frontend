// import { browser } from '$app/environment';
import { browser } from '$app/environment';
import { register, getLocaleFromNavigator, init } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('$lib/translations/en.json'));
/* register('en-GB', () => import('$lib/translations/en.json'));
register('fi-FI', () => import('$lib/translations/fi.json')); */
register('fi', () => import('$lib/translations/fi.json'));

register('sv', () => import('$lib/translations/sv.json'));
register('sa', () => import('$lib/translations/sa.json'));

const supportedLocales = ['en', 'fi', 'en-GB', 'fi-FI', 'sv', 'sv-fi', 'sa'];

export const getLocaleFromNavigatorSafe = () => {
	if (browser) {
		const possibleSavedLocale = localStorage.getItem('locale') || 'en';
		//const localeFromBrowser = getLocaleFromNavigator()?.slice(0, 2) || defaultLocale;
		//const finalLocale = possibleSavedLocale || localeFromBrowser;
		//return supportedLocales.includes(finalLocale) ? finalLocale : defaultLocale;
		return supportedLocales.includes(possibleSavedLocale) ? possibleSavedLocale : defaultLocale;
	}
	return defaultLocale;
}

		// Set the locale based on the user's preferences
init({
initialLocale: (() => {
	let initLocaleFromNavSafe = getLocaleFromNavigatorSafe();
	console.log("Setting initial locale in i18n.js");
	console.log(initLocaleFromNavSafe);
	return initLocaleFromNavSafe;
})(),
fallbackLocale: "en"
});