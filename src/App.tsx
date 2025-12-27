import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quizzes from './pages/Quizzes';
import QuizDetail from './pages/QuizDetail';
import Results from './pages/Results';
import QuestionsList from './pages/QuestionsList';
import EditQuiz from './pages/EditQuiz';
import EditQuestion from './pages/EditQuestion';
import TestExternalQuiz from './pages/TestExternalQuiz';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="quiz/:id" element={<QuizDetail />} />
            <Route path="results" element={<Results />} />
            <Route path="questions" element={<QuestionsList />} />
            <Route path="test-external-quiz" element={<TestExternalQuiz />} />
            <Route path="quiz/:id/edit" element={<EditQuiz />} />
            <Route path="quiz/:quizId/question/:questionId/edit" element={<EditQuestion />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;