import React, { useState } from 'react';
import { useQuizzes, useDeleteQuestion } from '../hooks/useQuizzes';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loader2, Plus, Pencil, Trash2, FileQuestion, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../components/ui/Modal';
import CreateQuizForm from '../components/CreateQuizForm';

const QuestionsList: React.FC = () => {
  const { data: quizzes, isLoading, isError, error } = useQuizzes();
  const { mutate: deleteQuestion } = useDeleteQuestion();
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);

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

  // Flatten all questions from all quizzes
  const allQuestions = quizzes?.flatMap(quiz =>
    (quiz.questions || []).map(question => ({
      ...question,
      quizId: quiz.id,
      quizTitle: quiz.title
    }))
  ) || [];

  const handleDeleteQuestion = (quizId: string, questionId: string, questionText: string) => {
    if (window.confirm(`Are you sure you want to delete the question "${questionText}"?`)) {
      deleteQuestion({ quizId, questionId });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">All Questions</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all questions across your quizzes</p>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setIsCreateQuizOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Questions (via new Quiz)
        </Button>
      </div>

      {allQuestions && allQuestions.length > 0 ? (
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 w-12">#</th>
                  <th className="px-6 py-4 w-1/3">Question</th>
                  <th className="px-6 py-4">Quiz</th>
                  <th className="px-6 py-4 w-1/4">Options</th>
                  <th className="px-6 py-4">Correct Answer</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allQuestions.map((question, index) => (
                  <motion.tr
                    key={`${question.quizId}-${question.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                      {question.text}
                    </td>
                    <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400">
                      <Link to={`/quiz/${question.quizId}`} className="hover:underline">
                        {question.quizTitle}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {question.options.map((option, optIndex) => (
                          <li key={optIndex} className="truncate max-w-[200px]">{option}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success" className="mb-1">
                        {String.fromCharCode(65 + question.correctAnswer)}
                      </Badge>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">
                        {question.options[question.correctAnswer]}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/quiz/${question.quizId}/question/${question.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteQuestion(question.quizId, question.id, question.text)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <FileQuestion className="h-10 w-10 text-slate-400" />
          </div>
          <h4 className="text-xl font-semibold mb-2">No questions available yet</h4>
          <p className="text-slate-500 mb-6">Create a quiz to add and manage questions</p>
          <Button onClick={() => setIsCreateQuizOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Quiz
          </Button>
        </div>
      )}
      <Modal
        isOpen={isCreateQuizOpen}
        onClose={() => setIsCreateQuizOpen(false)}
        title="Create New Quiz"
      >
        <CreateQuizForm onClose={() => setIsCreateQuizOpen(false)} />
      </Modal>
    </div>
  );
};

export default QuestionsList;
