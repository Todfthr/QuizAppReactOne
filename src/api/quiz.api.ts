import type { Quiz, QuizResult, Question } from '../types/quiz.types';
import axios from 'axios';

// JSON Server service for Quiz App
const API_URL = 'http://localhost:3001';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Quiz endpoints
export const quizApi = {
  // Get all quizzes
  getQuizzes: async (): Promise<Quiz[]> => {
    const response = await apiClient.get<Quiz[]>('/quizzes');
    return response.data;
  },

  // Get quiz by ID
  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await apiClient.get<Quiz>(`/quizzes/${id}`);
    return response.data;
  },

  // Create a new quiz
  createQuiz: async (quiz: Omit<Quiz, 'id'>): Promise<Quiz> => {
    const response = await apiClient.post<Quiz>('/quizzes', quiz);
    return response.data;
  },

  // Update a quiz
  updateQuiz: async (id: string, quiz: Partial<Quiz>): Promise<Quiz> => {
    const response = await apiClient.put<Quiz>(`/quizzes/${id}`, quiz);
    return response.data;
  },

  // Add questions to an existing quiz
  addQuestionsToQuiz: async (quizId: string, questions: Omit<Question, 'id'>[]): Promise<Quiz> => {
    // First get the existing quiz
    const quiz = await quizApi.getQuizById(quizId);
    
    // Ensure questions have proper structure and convert correctAnswer to number
    const formattedQuestions = questions.map((question, index) => ({
      ...question,
      // Generate a unique ID for each question if not present
      id: `q_${Date.now()}_${index}`,
      // Ensure correctAnswer is a number
      correctAnswer: typeof question.correctAnswer === 'string' 
        ? parseInt(question.correctAnswer, 10) 
        : question.correctAnswer
    }));
    
    // Combine existing questions with new questions
    const existingQuestions = quiz.questions || [];
    const updatedQuestions = [...existingQuestions, ...formattedQuestions];
    
    // Update the quiz with the new questions
    const response = await apiClient.patch<Quiz>(`/quizzes/${quizId}`, {
      questions: updatedQuestions
    });
    
    return response.data;
  },

  // Update a question in a quiz
  updateQuestion: async (quizId: string, questionId: string, question: Partial<Question>): Promise<Quiz> => {
    // First get the existing quiz
    const quiz = await quizApi.getQuizById(quizId);
    
    // Find and update the specific question
    const updatedQuestions = quiz.questions.map(q => 
      q.id === questionId ? { ...q, ...question } : q
    );
    
    // Update the quiz with the updated questions
    const response = await apiClient.patch<Quiz>(`/quizzes/${quizId}`, {
      ...quiz,
      questions: updatedQuestions
    });
    
    return response.data;
  },

  // Delete a quiz by ID
  deleteQuiz: async (id: string): Promise<void> => {
    await apiClient.delete(`/quizzes/${id}`);
  },

  // Delete a question by ID from a quiz
  deleteQuestion: async (quizId: string, questionId: string): Promise<Quiz> => {
    // First get the quiz
    const quiz = await quizApi.getQuizById(quizId);
    
    // Filter out the question to delete
    const updatedQuestions = quiz.questions.filter(q => q.id !== questionId);
    
    // Update the quiz with the filtered questions
    const response = await apiClient.patch<Quiz>(`/quizzes/${quizId}`, {
      ...quiz,
      questions: updatedQuestions
    });
    
    return response.data;
  },

  // Submit quiz result
  submitQuizResult: async (result: Omit<QuizResult, 'id'>): Promise<QuizResult> => {
    const response = await apiClient.post<QuizResult>('/results', result);
    return response.data;
  },

  // Get quiz results
  getResults: async (): Promise<QuizResult[]> => {
    const response = await apiClient.get<QuizResult[]>('/results');
    return response.data;
  },
};