import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { externalQuizApi } from '../api/external-quiz.api';
import { convertExternalQuizToInternal } from '../utils/externalQuiz.utils';
import { useCreateQuiz } from '../hooks/useQuizzes';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loader2, ArrowLeft, Wand2, Sparkles } from 'lucide-react';

const TestExternalQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createQuiz, isPending: isCreating } = useCreateQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('give 10 questions of easy level in React');

  const handleGenerateQuiz = async () => {
    try {
      setIsLoading(true);
      // Generate quiz from external API
      const externalQuiz = await externalQuizApi.generateQuiz(query);

      // Convert to internal format
      const questions = convertExternalQuizToInternal(externalQuiz);

      // Create quiz with generated questions
      const quizData = {
        title: externalQuiz.title || 'Generated Quiz',
        description: `Generated ${externalQuiz.difficulty} level quiz`,
        duration: 600, // 10 minutes
        questions: questions,
      };

      createQuiz(quizData, {
        onSuccess: () => {
          setIsLoading(false);
          toast.success('Quiz generated and created successfully!');
          // Navigate to quizzes page
          navigate('/quizzes');
        },
        onError: (error: Error) => {
          setIsLoading(false);
          toast.error(`Failed to create quiz: ${error.message}`);
        }
      });
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        toast.error(`Failed to generate quiz: ${error.message}`);
      } else {
        toast.error('Failed to generate quiz: Unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quizzes')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Quiz Generator</h2>
            <p className="text-slate-600 dark:text-slate-400">Generate quizzes instantly with AI</p>
          </div>
        </div>
      </div>

      <Card className="border-t-4 border-t-indigo-600 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 flex flex-col items-center justify-center text-center border-b border-indigo-100 dark:border-indigo-900/30">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Supercharge Your Learning</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md">
            Enter a topic, difficulty, or specific instructions, and our AI will generate a custom quiz for you in seconds.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="query" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Wand2 className="w-4 h-4" /> Prompt
            </label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Create a 10-question history quiz about World War II"
              className="h-12 text-lg"
            />
            <p className="text-xs text-slate-500 italic">
              Try: "make an intermediate level quiz of 10 questions based on flutter"
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full text-lg h-14"
              onClick={handleGenerateQuiz}
              disabled={isLoading || isCreating || !query.trim()}
            >
              {isLoading || isCreating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isLoading ? 'Generating Questions...' : 'Creating Quiz...'}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Quiz
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/quizzes')}
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>Uses external Quiz API to generate content dynamically.</p>
      </div>
    </div>
  );
};

export default TestExternalQuiz;
