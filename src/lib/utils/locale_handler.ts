export function getLocaleFullName(): string {
    const localeShort = localStorage.getItem('locale') || 'en';
    
    const localeMap: { [key: string]: string } = {
        'en': 'English',
        'sv': 'Swedish', 
        'se': 'Sami',
        'fi': 'Finnish'
    };

    return localeMap[localeShort] || 'English'; // Default to English if locale not found
}
