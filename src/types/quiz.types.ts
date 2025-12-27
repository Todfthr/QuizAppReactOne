import type { Question as ExternalQuestion } from './external-api.types';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  duration?: number; // in minutes
}

// Types for the external API response
export interface ExternalQuizResponse {
  title: string;
  difficulty: string;
  questions: ExternalQuestion[];
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
  completedAt: string;
}