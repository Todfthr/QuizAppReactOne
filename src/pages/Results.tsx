import React, { useState } from 'react';
import { useQuizResults, useQuizzes } from '../hooks/useQuizzes';
import { Loader2, AlertCircle, Calendar, BarChart2, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const Results: React.FC = () => {
  const { data: results, isLoading: resultsLoading, isError: resultsError, error: resultsErrorObj } = useQuizResults();
  const { data: quizzes, isLoading: quizzesLoading, isError: quizzesError, error: quizzesErrorObj } = useQuizzes();
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);

  const toggleResult = (id: string) => {
    setExpandedResultId(expandedResultId === id ? null : id);
  };

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

  // Create a map of quiz IDs to quiz objects for easy lookup
  const quizMap = quizzes?.reduce((map, quiz) => {
    map[quiz.id] = quiz;
    return map;
  }, {} as Record<string, typeof quizzes[0]>) || {};

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
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((result, index) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  const isExpanded = expandedResultId === result.id;
                  const quiz = quizMap[result.quizId];

                  return (
                    <React.Fragment key={result.id}>
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
                        onClick={() => toggleResult(result.id)}
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                          {quiz?.title || `Quiz #${result.id}`}
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
                        <td className="px-6 py-4">
                          {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </td>
                      </motion.tr>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800"
                          >
                            <td colSpan={5} className="px-6 py-6">
                              <div className="space-y-6">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Detailed Results</h4>
                                {quiz ? (
                                  <div className="space-y-6">
                                    {quiz.questions.map((question, qIndex) => {
                                      const userAnswer = result.answers.find(a => a.questionId === question.id);
                                      const selectedOption = userAnswer?.selectedOption;
                                      const isCorrect = selectedOption === question.correctAnswer;

                                      return (
                                        <div key={question.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                                          <div className="flex gap-3 mb-3">
                                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold">
                                              {qIndex + 1}
                                            </span>
                                            <p className="text-slate-800 dark:text-slate-200 font-medium">{question.text}</p>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                                            {question.options.map((option, optIndex) => {
                                              const isSelected = selectedOption === optIndex;
                                              const isAnswer = question.correctAnswer === optIndex;

                                              let optionClass = "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-70"; // Default

                                              if (isAnswer) {
                                                optionClass = "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500";
                                              } else if (isSelected && !isAnswer) {
                                                optionClass = "border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-500";
                                              }

                                              return (
                                                <div
                                                  key={optIndex}
                                                  className={`p-3 rounded-md border text-sm flex items-start gap-2 ${optionClass}`}
                                                >
                                                  <div className="mt-0.5">
                                                    {isAnswer && <Check className="h-4 w-4 text-green-600 dark:text-green-400" />}
                                                    {isSelected && !isAnswer && <X className="h-4 w-4 text-red-600 dark:text-red-400" />}
                                                    {!isAnswer && !(isSelected && !isAnswer) && <div className="h-4 w-4" />}
                                                  </div>
                                                  <span className={isAnswer || isSelected ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}>
                                                    {option}
                                                  </span>
                                                  {isSelected && (
                                                    <span className="ml-auto text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                      You
                                                    </span>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 flex items-center">
                                    <AlertCircle className="mr-2 h-5 w-5" />
                                    <span>Detailed questions for this quiz are no longer available.</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
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
