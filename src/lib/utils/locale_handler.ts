export function getLocaleFullName(): string {
    const localeShort = localStorage.getItem('locale') || 'en';
    console.log(`Retrieved locale from localStorage: ${localeShort}`);
    const allowedLocales = ['en', 'fi', 'sv', 'sa'];
    if (!allowedLocales.includes(localeShort)) {
        // If locale is not English or Finnish, raise an error
        console.error(`Unsupported locale: ${localeShort}`);
        console.log('Falling back to English locale.');
        localStorage.setItem('locale', 'en'); // Reset to default
    } else {
        console.log(`Locale ${localeShort} is supported.`);
    }
    console.log(`Current locale: ${localeShort}`);
    const localeMap: { [key: string]: string } = {
        'en': 'English',
        'fi': 'Finnish',
        'sv': 'Swedish', 
        'sa': 'North Sámi'
    };
    return localeMap[localeShort] || localeMap['en']; // Default to English if locale not found
}
