import { locale } from 'svelte-i18n'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handle: any = async ({ event, resolve }: { event: any; resolve: any }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0]
	if (lang) {
		locale.set(lang)
	}
	return resolve(event)
}