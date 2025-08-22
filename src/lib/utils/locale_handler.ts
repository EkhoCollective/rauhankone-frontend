export function getLocaleFullName(): string {
    const localeShort = localStorage.getItem('locale') || 'en';
    
    const localeMap: { [key: string]: string } = {
        'en': 'English',
        'fi': 'Finnish',
        /* 'sv': 'Swedish', 
        'sa': 'North Sámi' */
    };

    return localeMap[localeShort] || 'English'; // Default to English if locale not found
}
