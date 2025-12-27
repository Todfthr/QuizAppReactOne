import React, { useState } from 'react';
import { useQuizzes } from '../hooks/useQuizzes';
import QuizCard from '../components/QuizCard';
import { Button } from '../components/ui/Button';
import { PlusCircle, Loader2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../components/ui/Modal';
import CreateQuizForm from '../components/CreateQuizForm';

const Quizzes: React.FC = () => {
  const { data: quizzes, isLoading, isError, error } = useQuizzes();
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    console.error("Error loading quizzes:", error);
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span className="font-medium">Error:</span> {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Available Quizzes</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Challenge yourself with our collection of quizzes</p>
        </div>
        <Button
          className="gap-2 shadow-lg shadow-indigo-500/20"
          onClick={() => setIsCreateQuizOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      {quizzes && quizzes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <QuizCard quiz={quiz} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <BookOpen className="h-10 w-10 text-slate-400" />
          </div>
          <h4 className="text-xl font-semibold mb-2">No quizzes available yet</h4>
          <p className="text-slate-500 mb-6">Be the first to create a quiz!</p>
          <Button onClick={() => setIsCreateQuizOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
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

export default Quizzes;
