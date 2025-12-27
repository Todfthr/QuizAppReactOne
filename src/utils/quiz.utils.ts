import type { Question, UserAnswer } from "../types/quiz.types";

/**
 * Calculate the score based on user answers and questions
 */
export const calculateScore = (questions: Question[], answers: UserAnswer[]): number => {
  return answers.reduce((score, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedOption) {
      return score + 1;
    }
    return score;
  }, 0);
};

/**
 * Check if a question has been answered
 */
export const isQuestionAnswered = (questionId: string, answers: UserAnswer[]): boolean => {
  return answers.some(answer => answer.questionId === questionId);
};

/**
 * Get the selected option for a question
 */
export const getSelectedOption = (questionId: string, answers: UserAnswer[]): number | null => {
  const answer = answers.find(a => a.questionId === questionId);
  return answer ? answer.selectedOption : null;
};