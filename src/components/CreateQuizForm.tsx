import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateQuiz } from '../hooks/useQuizzes';
import { useNavigate } from 'react-router-dom';
import { externalQuizApi } from '../api/external-quiz.api';
import { convertExternalQuizToInternal, generateQuizQuery } from '../utils/externalQuiz.utils';
import { toast } from 'react-toastify';
import type { Quiz } from '../types/quiz.types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Loader2, Wand2, Plus, Type, FileText, Clock, Hash, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface QuizForm {
    title: string;
    description: string;
    duration: number;
    topic: string;
    generateFromAI: boolean;
}

interface CreateQuizFormProps {
    onClose: () => void;
}

const CreateQuizForm: React.FC<CreateQuizFormProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const { mutate: createQuiz, isPending } = useCreateQuiz();
    const [isGenerating, setIsGenerating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<QuizForm>({
        defaultValues: {
            title: '',
            description: '',
            duration: 600, // Default to 600 seconds (10 minutes)
            topic: '',
            generateFromAI: false
        },
    });

    const generateFromAI = watch('generateFromAI');

    const onSubmit = async (data: QuizForm) => {
        try {
            if (data.generateFromAI) {
                setIsGenerating(true);
                const query = generateQuizQuery(data.topic || 'general knowledge', 'easy', 10);
                const externalQuiz = await externalQuizApi.generateQuiz(query);
                const questions = convertExternalQuizToInternal(externalQuiz);

                const quizData = {
                    title: data.title || externalQuiz.title,
                    description: data.description || `Generated ${externalQuiz.difficulty} level quiz`,
                    duration: Math.max(30, data.duration),
                    questions: questions,
                };

                createQuiz(quizData, {
                    onSuccess: () => {
                        setIsGenerating(false);
                        onClose();
                        navigate('/quizzes');
                    },
                    onError: (error: Error) => {
                        setIsGenerating(false);
                        toast.error(`Failed to create quiz: ${error.message}`);
                    }
                });
            } else {
                const quizData = {
                    title: data.title,
                    description: data.description,
                    duration: Math.max(30, data.duration),
                    questions: [],
                };

                createQuiz(quizData, {
                    onSuccess: (createdQuiz: Quiz) => {
                        onClose();
                        navigate(`/quiz/${createdQuiz.id}`);
                    },
                });
            }
        } catch (error: unknown) {
            setIsGenerating(false);
            if (error instanceof Error) {
                toast.error(`Failed to generate quiz: ${error.message}`);
            } else {
                toast.error('Failed to generate quiz: Unknown error occurred');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <label className="flex items-center cursor-pointer gap-3">
                    <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        id="generateFromAI"
                        {...register('generateFromAI')}
                    />
                    <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                        <BrainCircuit className="w-5 h-5 text-indigo-500" />
                        Generate quiz from AI
                    </div>
                </label>
            </div>

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
                <label htmlFor="duration" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4" /> Duration (seconds)
                </label>
                <Input
                    type="number"
                    id="duration"
                    placeholder="e.g. 300 for 5 mins"
                    {...register('duration', {
                        required: 'Duration is required',
                        min: { value: 30, message: 'Min 30 seconds' },
                        max: { value: 7200, message: 'Max 2 hours' },
                        valueAsNumber: true
                    })}
                    className={cn(errors.duration && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.duration && (
                    <p className="text-sm text-red-500">{errors.duration.message}</p>
                )}
            </div>

            {generateFromAI ? (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                >
                    <label htmlFor="topic" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Hash className="w-4 h-4" /> Topic
                    </label>
                    <Input
                        id="topic"
                        placeholder="e.g. React, History, Science..."
                        {...register('topic', {
                            required: generateFromAI ? 'Topic is required for AI generation' : false
                        })}
                        className={cn(errors.topic && "border-red-500 focus-visible:ring-red-500")}
                    />
                    <p className="text-xs text-slate-500">The AI will generate questions based on this topic.</p>
                    {errors.topic && (
                        <p className="text-sm text-red-500">{errors.topic.message}</p>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                >
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
                </motion.div>
            )}

            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    className="flex-1"
                    size="lg"
                    disabled={isPending || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            {generateFromAI ? <Wand2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                            {generateFromAI ? 'Generate with AI' : 'Create Quiz'}
                        </>
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default CreateQuizForm;
