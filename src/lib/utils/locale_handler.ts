export function getLocaleFullName(): string {
    const localeShort = localStorage.getItem('locale') || 'en';
    if (localeShort !== 'en' && localeShort !== 'fi') {
        // If locale is not English or Finnish, raise an error
        console.error(`Unsupported locale: ${localeShort}`);
        localStorage.setItem('locale', 'en'); // Reset to default
        return 'English'; // Default to English on error
    }
    console.log(`Current locale: ${localeShort}`);
    const localeMap: { [key: string]: string } = {
        'en': 'English',
        'fi': 'Finnish',
        /* 'sv': 'Swedish', 
        'sa': 'North Sámi' */
    };

    return localeMap[localeShort] || 'English'; // Default to English if locale not found
}
