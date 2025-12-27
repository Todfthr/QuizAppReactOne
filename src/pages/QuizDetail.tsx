import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz, useSubmitQuizResult } from '../hooks/useQuizzes';
import Question from '../components/Question';
import type { UserAnswer } from '../types/quiz.types';
import { calculateScore, getSelectedOption } from '../utils/quiz.utils';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loader2, AlertCircle, Clock, CheckCircle, ArrowRight, ArrowLeft, Trophy, RotateCcw, List, AlertTriangle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { Modal } from '../components/ui/Modal';
import AddQuestionsForm from '../components/AddQuestionsForm';

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading, isError, error } = useQuiz(id!);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(-1);
  const [timerExpired, setTimerExpired] = useState(false);
  const [isAddQuestionsOpen, setIsAddQuestionsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSetInitialTime = useRef(false);

  const { mutate: submitResult } = useSubmitQuizResult();

  useEffect(() => {
    if (quiz && quiz.duration != null && !hasSetInitialTime.current && timeLeft === -1) {
      setTimeout(() => {
        const durationInSeconds = typeof quiz.duration === 'string'
          ? parseInt(quiz.duration, 10) * 60
          : quiz.duration;

        setTimeLeft(durationInSeconds || 0);
      }, 0);
      hasSetInitialTime.current = true;
    }
  }, [quiz, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !quizCompleted && hasSetInitialTime.current) {
      setTimeout(() => {
        setTimerExpired(true);
        setQuizCompleted(true);
      }, 0);
      return;
    }

    if (quiz && quiz.duration != null && timeLeft > 0 && !quizCompleted && !timerExpired) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, quizCompleted, timerExpired, quiz]);

  useEffect(() => {
    if (quizCompleted && quiz) {
      const calculatedScore = calculateScore(quiz.questions, answers);
      const result = {
        quizId: quiz.id,
        userId: 'user1',
        answers,
        score: calculatedScore,
        totalQuestions: quiz.questions.length,
        completedAt: new Date().toISOString(),
      };

      submitResult(result);
    }
  }, [quizCompleted, quiz, answers, submitResult]);

  const handleOptionSelect = (optionIndex: number) => {
    if (!quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = {
        questionId: currentQuestion.id,
        selectedOption: optionIndex
      };
    } else {
      newAnswers.push({
        questionId: currentQuestion.id,
        selectedOption: optionIndex
      });
    }

    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setTimerExpired(false);
    hasSetInitialTime.current = false;
    if (quiz && quiz.duration != null) {
      const durationInSeconds = typeof quiz.duration === 'string'
        ? parseInt(quiz.duration, 10) * 60
        : quiz.duration;

      setTimeLeft(durationInSeconds || 0);
      hasSetInitialTime.current = true;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 flex items-center">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>Error: {(error as Error).message}</span>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 flex items-center">
        <AlertTriangle className="mr-2 h-5 w-5" />
        <span>Quiz not found</span>
      </div>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <Card className="p-8 border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Questions Added</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This quiz doesn't have any questions yet. Add some questions to start playing!
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsAddQuestionsOpen(true)}>
              Add Questions
            </Button>
            <Button variant="outline" onClick={() => navigate('/quizzes')}>
              Back to Quizzes
            </Button>
          </div>
          <Modal
            isOpen={isAddQuestionsOpen}
            onClose={() => setIsAddQuestionsOpen(false)}
            title="Add Questions"
          >
            <AddQuestionsForm quizId={quiz.id} onClose={() => setIsAddQuestionsOpen(false)} />
          </Modal>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const calculatedScore = calculateScore(quiz.questions, answers);
    const percentage = Math.round((calculatedScore / quiz.questions.length) * 100);
    const isSuccess = percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="text-center p-8 border-t-8 border-t-indigo-600">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 flex justify-center"
          >
            {timerExpired ? (
              <div className="h-24 w-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="h-12 w-12" />
              </div>
            ) : (
              <div className={`h-24 w-24 rounded-full flex items-center justify-center ${isSuccess
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                }`}>
                <Trophy className="h-12 w-12" />
              </div>
            )}
          </motion.div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {timerExpired ? "Time's Up!" : "Quiz Completed!"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {timerExpired
              ? "Your time for this quiz has expired. Answers submitted automatically."
              : `You scored ${calculatedScore} out of ${quiz.questions.length}`}
          </p>

          <div className="relative h-6 w-full rounded-full bg-slate-100 dark:bg-slate-800 mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
            />
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-10">
            {percentage}%
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleRestart} size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Restart Quiz
            </Button>
            <Button variant="outline" onClick={() => navigate('/quizzes')} size="lg">
              <List className="mr-2 h-5 w-5" />
              Back to Quizzes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = getSelectedOption(currentQuestion.id, answers);
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate max-w-md">{quiz.title}</h2>
        <div className="flex items-center gap-3">
          {quiz.duration && timeLeft >= 0 && (
            <Badge variant={timeLeft < 60 ? "warning" : "default"} className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </Badge>
          )}
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            {currentQuestionIndex + 1} / {quiz.questions.length}
          </Badge>
        </div>
      </div>

      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <Card className="mb-8 border-t-4 border-t-indigo-600">
        <Question
          question={currentQuestion}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
        />

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <>
                Finish Quiz
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizDetail;
