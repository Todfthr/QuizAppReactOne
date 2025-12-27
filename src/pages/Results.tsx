import React from 'react';
import { useQuizResults, useQuizzes } from '../hooks/useQuizzes';
import { Loader2, AlertCircle, Calendar, BarChart2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';

const Results: React.FC = () => {
  const { data: results, isLoading: resultsLoading, isError: resultsError, error: resultsErrorObj } = useQuizResults();
  const { data: quizzes, isLoading: quizzesLoading, isError: quizzesError, error: quizzesErrorObj } = useQuizzes();

  if (resultsLoading || quizzesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (resultsError || quizzesError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 flex items-center">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>Error: {(resultsErrorObj as Error)?.message || (quizzesErrorObj as Error)?.message}</span>
      </div>
    );
  }

  // Create a map of quiz IDs to quiz titles for easy lookup
  const quizTitleMap = quizzes?.reduce((map, quiz) => {
    map[quiz.id] = quiz.title;
    return map;
  }, {} as Record<string, string>) || {};

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Quiz Results</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">View your performance history across all quizzes</p>
      </div>

      {results && results.length > 0 ? (
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Quiz</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((result, index) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  return (
                    <motion.tr
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {quizTitleMap[result.quizId] || `Quiz #${result.quizId}`}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="font-mono">
                          {result.score} / {result.totalQuestions}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.completedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                            {percentage}%
                          </span>
                          <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <BarChart2 className="h-10 w-10 text-slate-400" />
          </div>
          <h4 className="text-xl font-semibold mb-2">No results yet</h4>
          <p className="text-slate-500">Complete a quiz to see your results here</p>
        </div>
      )}
    </div>
  );
};

export default Results;
