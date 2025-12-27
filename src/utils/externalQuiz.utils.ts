import type { ExternalQuizResponse, Question } from '../types/quiz.types';

/**
 * Convert external quiz response to internal quiz format
 */
export const convertExternalQuizToInternal = (externalQuiz: ExternalQuizResponse): Question[] => {
  return externalQuiz.questions.map((extQuestion, index) => {
    // Find the index of the correct answer in the options array
    const correctAnswerIndex = extQuestion.options.indexOf(extQuestion.answer);
    
    return {
      id: `q_${Date.now()}_${index}`,
      text: extQuestion.question,
      options: extQuestion.options,
      correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0 // Default to 0 if not found
    };
  });
};

/**
 * Generate a query string for the external API based on topic and difficulty
 */
export const generateQuizQuery = (topic: string, difficulty: string = 'easy', count: number = 10): string => {
  return `give ${count} questions of ${difficulty} level in ${topic}`;
};