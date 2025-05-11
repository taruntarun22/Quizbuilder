import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import PrivateRoute from './components/auth/PrivateRoute';
import PublicRoute from './components/auth/PublicRoute';
import AdminRoute from './components/auth/AdminRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import CreateQuiz from './pages/quiz/CreateQuiz';
import PlayQuiz from './pages/quiz/PlayQuiz';
import CompletedQuizzes from './pages/quiz/CompletedQuizzes';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/create-quiz" element={<CreateQuiz />} />
                <Route path="/play-quiz/:id" element={<PlayQuiz />} />
                <Route path="/completed-quizzes" element={<CompletedQuizzes />} />
              </Route>
              
              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;