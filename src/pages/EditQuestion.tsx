import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, useUpdateQuestion } from '../hooks/useQuizzes';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loader2, ArrowLeft, Save, HelpCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface EditQuestionForm {
  text: string;
  options: string[];
  correctAnswer: number;
}

const EditQuestion: React.FC = () => {
  const { quizId, questionId } = useParams<{ quizId: string; questionId: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading, isError, error } = useQuiz(quizId!);
  const { mutate: updateQuestion, isPending } = useUpdateQuestion();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<EditQuestionForm>({
    defaultValues: {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  });

  // Find the question to edit
  const question = React.useMemo(() => {
    if (!quiz) return null;
    return quiz.questions.find(q => q.id === questionId);
  }, [quiz, questionId]);

  // Reset form when question data is loaded
  React.useEffect(() => {
    if (question) {
      reset({
        text: question.text,
        options: [...question.options],
        correctAnswer: question.correctAnswer,
      });
    }
  }, [question, reset]);

  // Watch the form values
  const options = watch('options');

  const onSubmit = (data: EditQuestionForm) => {
    if (!quizId || !questionId) {
      toast.error('Quiz ID or Question ID is missing');
      return;
    }

    // Validate that correctAnswer is within bounds
    if (data.correctAnswer < 0 || data.correctAnswer >= data.options.length) {
      toast.warn('Please select a valid correct answer');
      return;
    }

    updateQuestion({
      quizId,
      questionId,
      question: {
        text: data.text,
        options: data.options,
        correctAnswer: data.correctAnswer,
      }
    }, {
      onSuccess: () => {
        // Toast notification is handled in the hook
        navigate('/questions');
      },
    });
  };

  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setValue('options', newOptions);
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
        <AlertTriangle className="mr-2 h-5 w-5" />
        <span>Error: {(error as Error).message}</span>
      </div>
    );
  }

  if (!quiz || !question) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 flex items-center">
        <AlertTriangle className="mr-2 h-5 w-5" />
        <span>Quiz or question not found</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/questions')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Edit Question</h2>
            <p className="text-slate-600 dark:text-slate-400">Editing question for quiz: <span className="font-semibold">{quiz.title}</span></p>
          </div>
        </div>
      </div>

      <Card className="border-t-4 border-t-indigo-600 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="text" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <HelpCircle className="w-4 h-4" /> Question Text
            </label>
            <Input
              id="text"
              placeholder="Enter your question here..."
              {...register('text', { required: 'Question text is required' })}
              className={cn(errors.text && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.text && (
              <p className="text-sm text-red-500">{errors.text.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Options</label>
            <div className="grid grid-cols-1 gap-4">
              {options.map((option, index) => (
                <div key={index} className="relative group">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-500">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1 relative">
                      <Input
                        value={option}
                        placeholder={`Option ${String.fromCharCode(65 + index)}...`}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className={cn(
                          "pr-12",
                          errors.options?.[index] && "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                        <input
                          type="radio"
                          id={`correctAnswer-${index}`}
                          {...register('correctAnswer', {
                            valueAsNumber: true
                          })}
                          value={index}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.options?.[index] && (
                    <p className="text-xs text-red-500 mt-1 ml-11">
                      {errors.options[index]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Question
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/questions')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditQuestion;
