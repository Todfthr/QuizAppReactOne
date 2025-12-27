import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi } from '../api/quiz.api';
import type { Quiz, QuizResult, Question } from '../types/quiz.types';
import { toast } from 'react-toastify';

export const useQuizzes = () => {
  return useQuery<Quiz[], Error>({
    queryKey: ['quizzes'],
    queryFn: quizApi.getQuizzes,
  });
};

export const useQuiz = (id: string) => {
  return useQuery<Quiz, Error>({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getQuizById(id),
    enabled: !!id,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quizApi.createQuiz,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz created successfully!');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Failed to create quiz: ${error.message}`);
    }
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, quiz }: { id: string; quiz: Partial<Quiz> }) => 
      quizApi.updateQuiz(id, quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      toast.success('Quiz updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update quiz: ${error.message}`);
    }
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizId, questionId, question }: { quizId: string; questionId: string; question: Partial<Question> }) => 
      quizApi.updateQuestion(quizId, questionId, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      toast.success('Question updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update question: ${error.message}`);
    }
  });
};

// Custom hook to add questions to an existing quiz
export const useAddQuestionsToQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizId, questions }: { quizId: string; questions: Omit<Question, 'id'>[] }) => 
      quizApi.addQuestionsToQuiz(quizId, questions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      toast.success('Questions added successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add questions: ${error.message}`);
    }
  });
};

// Custom hook to delete a quiz
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quizApi.deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete quiz: ${error.message}`);
    }
  });
};

// Custom hook to delete a question from a quiz
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizId, questionId }: { quizId: string; questionId: string }) => 
      quizApi.deleteQuestion(quizId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      toast.success('Question deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete question: ${error.message}`);
    }
  });
};

// Custom hook to submit quiz results
export const useSubmitQuizResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quizApi.submitQuizResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast.success('Quiz completed! Results saved.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit quiz results: ${error.message}`);
    }
  });
};

// Custom hook to fetch quiz results
export const useQuizResults = () => {
  return useQuery<QuizResult[], Error>({
    queryKey: ['results'],
    queryFn: quizApi.getResults,
  });
};