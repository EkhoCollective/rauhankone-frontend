// import type { Handle } from '@sveltejs/kit';
// import { paraglideMiddleware } from './lib/paraglide/server.js';

// // creating a handle to use the paraglide middleware
// const paraglideHandle: Handle = ({ event, resolve }) =>
// 	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
// 		event.request = localizedRequest;
// 		return resolve(event, {
// 			transformPageChunk: ({ html }) => {
// 				return html.replace('%lang%', locale);
// 			}
// 		});
// 	});

// export const handle: Handle = paraglideHandle;


import type { Handle } from '@sveltejs/kit'
import { locale } from 'svelte-i18n'

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0]
	if (lang) {
		locale.set(lang)
	}
	return resolve(event)
}