import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Quiz } from '../types/quiz.types';
import { useDeleteQuiz } from '../hooks/useQuizzes';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Clock, HelpCircle, Pencil, Trash2, Play, Plus } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import AddQuestionsForm from './AddQuestionsForm';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const { mutate: deleteQuiz } = useDeleteQuiz();
  const [isAddQuestionsOpen, setIsAddQuestionsOpen] = useState(false);

  const formatDuration = (duration: number | string): string => {
    const seconds = typeof duration === 'string' ? parseInt(duration, 10) : duration;

    if (isNaN(seconds) || seconds <= 0) {
      return '';
    }

    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return `${mins} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the quiz "${quiz.title}"?`)) {
      deleteQuiz(quiz.id);
    }
  };

  return (
    <>
      <Card hoverEffect className="h-full flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{quiz.title}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">{quiz.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {(quiz.questions || []).length} Qs
            </Badge>
            {quiz.duration && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(quiz.duration)}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link to={`/quiz/${quiz.id}`} className="flex-1">
            <Button className="w-full gap-2">
              <Play className="w-4 h-4" /> Start
            </Button>
          </Link>
          <Link to={`/quiz/${quiz.id}/edit`}>
            <Button variant="outline" size="sm" className="px-3" title="Edit Quiz">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            title="Add Questions"
            onClick={() => setIsAddQuestionsOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="px-3"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={isAddQuestionsOpen}
        onClose={() => setIsAddQuestionsOpen(false)}
        title={`Add Questions to ${quiz.title}`}
      >
        <AddQuestionsForm quizId={quiz.id} onClose={() => setIsAddQuestionsOpen(false)} />
      </Modal>
    </>
  );
};

export default QuizCard;
