const localeMap: { [key: string]: string } = {
    'en': 'English',
    'fi': 'Finnish',
    /* 'sv': 'Swedish', 
    'sa': 'North Sámi' */
};
export function getLocaleFullName(): string {
    const localeShort = localStorage.getItem('locale') || 'en';
    console.log('Retrieved locale from localStorage:', localeShort);
    if (localeShort !== 'en' && localeShort !== 'fi') {
        // If locale is not English or Finnish, raise an error
        console.error(`Unsupported locale: ${localeShort}`);
        localStorage.setItem('locale', 'en'); // Reset to default
        return 'English'; // Default to English on error
    }
    console.log(`Current locale: ${localeShort}`);

    console.log("Will return:", localeMap[localeShort] || 'English');

    return localeMap[localeShort] || 'English'; // Default to English if locale not found
}
