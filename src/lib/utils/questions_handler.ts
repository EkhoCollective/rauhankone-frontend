export function getLangFilteredQuestion(obj: any, locale:string) :string {
  const questionsArray = obj.questions;
  const currentLocale = locale;

  if (Array.isArray(questionsArray) && questionsArray.length > 0) {
    const currentLocale = locale;
    const filteredQuestions = questionsArray.filter((q) => q.language === currentLocale);

    if (filteredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      return filteredQuestions[randomIndex].text;
    } else {
      // Fallback: if no questions for the current locale, pick a random one from all questions
      console.warn(
        `No questions found for locale: ${currentLocale}. Displaying a random question from all available.`
      );
      return "Object Error.";
    }
  } else {
    console.error('Questions array is missing or empty in the response:', obj);
    return 'No questions available at the moment.'; // Default message
  }
}