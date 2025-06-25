export function getLangFilteredQuestion(obj: any, locale: string): string {
  const questionsArray = obj.questions;

  if (Array.isArray(questionsArray) && questionsArray.length > 0) {
    const currentLocale = locale;
    
    // Randomly select a question group first
    const randomGroupIndex = Math.floor(Math.random() * questionsArray.length);
    const selectedQuestionGroup = questionsArray[randomGroupIndex];
    // Try to find a question in the current locale
    const filteredQuestion = selectedQuestionGroup.filter((q: any) => q.language === currentLocale);
  
    if (filteredQuestion.length > 0) {
      return filteredQuestion[0].text;
    } else {
      // Special case: if locale is North Sámi ('sa') and not found, fallback to English
      if (currentLocale === 'North Sámi') {
        const englishFallback = selectedQuestionGroup.filter((q: any) => q.language === 'English');
        if (englishFallback.length > 0) {
          console.warn(`No North Sámi questions found. Falling back to English.`);
          return englishFallback[0].text;
        }
      }
      // General fallback: if no questions for the current locale
      console.warn(
        `No questions found for locale: ${currentLocale}.`
      );
      return 'No questions available at the moment.'
    }
  } else {
    console.error('Questions array is missing or empty in the response:', obj);
    return 'No questions available at the moment.'; // Default message
  }
}