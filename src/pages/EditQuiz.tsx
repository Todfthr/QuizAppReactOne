import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, useUpdateQuiz } from '../hooks/useQuizzes';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loader2, ArrowLeft, Save, Type, FileText, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface EditQuizForm {
  title: string;
  description: string;
  duration: number;
}

const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading, isError, error } = useQuiz(id!);
  const { mutate: updateQuiz, isPending } = useUpdateQuiz();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditQuizForm>();

  // Reset form when quiz data is loaded
  React.useEffect(() => {
    if (quiz) {
      reset({
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration || 10,
      });
    }
  }, [quiz, reset]);

  const onSubmit = (data: EditQuizForm) => {
    if (!id) {
      toast.error('Quiz ID is missing');
      return;
    }

    updateQuiz({ id, quiz: data }, {
      onSuccess: () => {
        // Toast notification is handled in the hook
        navigate('/quizzes');
      },
    });
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

  if (!quiz) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 flex items-center">
        <AlertTriangle className="mr-2 h-5 w-5" />
        <span>Quiz not found</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quizzes')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Edit Quiz</h2>
            <p className="text-slate-600 dark:text-slate-400">Update details for <span className="font-semibold">{quiz.title}</span></p>
          </div>
        </div>
      </div>

      <Card className="border-t-4 border-t-indigo-600 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Type className="w-4 h-4" /> Quiz Title
            </label>
            <Input
              id="title"
              placeholder="Enter quiz title..."
              {...register('title', { required: 'Title is required' })}
              className={cn(errors.title && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white/50 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950/50 dark:placeholder:text-slate-400 dark:focus-visible:ring-indigo-500",
                errors.description && "border-red-500 focus-visible:ring-red-500"
              )}
              id="description"
              rows={3}
              placeholder="Briefly describe what this quiz is about..."
              {...register('description', { required: 'Description is required' })}
            ></textarea>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4" /> Duration (seconds)
            </label>
            <Input
              type="number"
              id="duration"
              placeholder="e.g. 10"
              {...register('duration', {
                required: 'Duration is required',
                min: { value: 1, message: 'Min 1 minute' },
                max: { value: 120, message: 'Max 120 minutes' },
                valueAsNumber: true
              })}
              className={cn(errors.duration && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
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
                  Update Quiz
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/quizzes')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditQuiz;
