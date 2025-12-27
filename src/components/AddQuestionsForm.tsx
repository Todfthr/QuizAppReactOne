import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuiz, useAddQuestionsToQuiz } from '../hooks/useQuizzes';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Loader2, Plus, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionForm {
    text: string;
    options: { value: string }[];
    correctAnswer: number;
}

interface AddQuestionsFormProps {
    quizId: string;
    onClose: () => void;
}

interface AddQuestionsFormValues {
    questions: QuestionForm[];
}

const AddQuestionsForm: React.FC<AddQuestionsFormProps> = ({ quizId, onClose }) => {
    const { data: quiz, isLoading, isError, error } = useQuiz(quizId);
    const { mutate: addQuestions, isPending } = useAddQuestionsToQuiz();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddQuestionsFormValues>({
        defaultValues: {
            questions: [
                {
                    text: '',
                    options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
                    correctAnswer: 0,
                },
            ],
        },
    });

    const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: 'questions',
    });

    const onSubmit = (data: AddQuestionsFormValues) => {
        const isValid = data.questions.every(question =>
            question.correctAnswer >= 0 && question.correctAnswer <= 3
        );

        if (!isValid) {
            toast.warn('Please select a valid correct answer for each question');
            return;
        }

        if (!quizId) {
            toast.error('Quiz ID is missing');
            return;
        }

        const questionsData = data.questions.map((question) => ({
            text: question.text,
            options: question.options.map(option => option.value),
            correctAnswer: typeof question.correctAnswer === 'string'
                ? parseInt(question.correctAnswer, 10)
                : question.correctAnswer,
        }));

        addQuestions({ quizId, questions: questionsData }, {
            onSuccess: () => {
                onClose();
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
                <AnimatePresence initial={false}>
                    {questions.map((question, questionIndex) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="border border-slate-200 dark:border-slate-800 relative bg-white dark:bg-slate-900">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-xl" />

                                <div className="flex justify-between items-start mb-4 pl-4">
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
                                            {questionIndex + 1}
                                        </span>
                                        Question
                                    </h3>
                                    {questions.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeQuestion(questionIndex)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="pl-4 space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Enter your question here..."
                                            {...register(`questions.${questionIndex}.text` as const, {
                                                required: 'Question text is required'
                                            })}
                                            className={cn(
                                                "text-lg font-medium border-0 border-b border-slate-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-indigo-500 bg-transparent placeholder:text-slate-400",
                                                errors.questions?.[questionIndex]?.text && "border-red-500"
                                            )}
                                        />
                                        {errors.questions?.[questionIndex]?.text && (
                                            <p className="text-sm text-red-500">{errors.questions[questionIndex]?.text?.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {question.options.map((_, optionIndex) => (
                                            <div key={optionIndex} className="relative group">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-500">
                                                        {String.fromCharCode(65 + optionIndex)}
                                                    </div>
                                                    <div className="flex-1 relative">
                                                        <Input
                                                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}...`}
                                                            {...register(`questions.${questionIndex}.options.${optionIndex}.value` as const, {
                                                                required: 'Option text is required'
                                                            })}
                                                            className={cn(
                                                                "pr-12",
                                                                errors.questions?.[questionIndex]?.options?.[optionIndex]?.value && "border-red-500 focus-visible:ring-red-500"
                                                            )}
                                                        />
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                                            <input
                                                                type="radio"
                                                                id={`questions.${questionIndex}.correctAnswer.${optionIndex}`}
                                                                {...register(`questions.${questionIndex}.correctAnswer` as const, {
                                                                    valueAsNumber: true
                                                                })}
                                                                value={optionIndex}
                                                                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {errors.questions?.[questionIndex]?.options?.[optionIndex]?.value && (
                                                    <p className="text-xs text-red-500 mt-1 ml-11">
                                                        {errors.questions[questionIndex]?.options?.[optionIndex]?.value?.message}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex justify-center py-4">
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-dashed border-2 w-full max-w-xs hover:border-indigo-500 hover:text-indigo-600"
                    onClick={() => appendQuestion({
                        text: '',
                        options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
                        correctAnswer: 0,
                    })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Question
                </Button>
            </div>

            <div className="flex gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                <Button
                    type="submit"
                    className="flex-1"
                    size="lg"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Questions...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Save All Questions
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

export default AddQuestionsForm;
