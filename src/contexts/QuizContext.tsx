import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  questions: Question[];
  published: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers: { questionId: string; selectedOption: number }[];
}

interface QuizContextType {
  quizzes: Quiz[];
  userAttempts: QuizAttempt[];
  getQuiz: (id: string) => Quiz | undefined;
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  saveQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  getUserQuizzes: (userId: string) => Quiz[];
  getCompletedQuizzes: (userId: string) => QuizAttempt[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userAttempts, setUserAttempts] = useState<QuizAttempt[]>([]);

  // Load saved quizzes and attempts from localStorage
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    const savedAttempts = localStorage.getItem('quizAttempts');
    
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    } else {
      // Add sample quizzes for demo if none exist
      const demoQuizzes = [
        {
          id: 'quiz-1',
          title: 'General Knowledge Quiz',
          description: 'Test your general knowledge with these questions!',
          createdBy: 'admin-user-1',
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: 'q1',
              text: 'What is the capital of France?',
              options: ['London', 'Berlin', 'Paris', 'Madrid'],
              correctAnswer: 2
            },
            {
              id: 'q2',
              text: 'Who painted the Mona Lisa?',
              options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Michelangelo'],
              correctAnswer: 1
            }
          ],
          published: true
        }
      ];
      setQuizzes(demoQuizzes);
      localStorage.setItem('quizzes', JSON.stringify(demoQuizzes));
    }
    
    if (savedAttempts) {
      setUserAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quizAttempts', JSON.stringify(userAttempts));
  }, [userAttempts]);

  const getQuiz = (id: string) => {
    return quizzes.find(quiz => quiz.id === id);
  };

  const createQuiz = (quiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: 'quiz-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.id === id ? { ...quiz, ...updates } : quiz
      )
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== id));
  };

  const saveQuizAttempt = (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: 'attempt-' + Math.random().toString(36).substr(2, 9),
      completedAt: new Date().toISOString()
    };
    setUserAttempts(prevAttempts => [...prevAttempts, newAttempt]);
  };

  const getUserQuizzes = (userId: string) => {
    return quizzes.filter(quiz => quiz.createdBy === userId);
  };

  const getCompletedQuizzes = (userId: string) => {
    return userAttempts.filter(attempt => attempt.userId === userId);
  };

  const value = {
    quizzes,
    userAttempts,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    saveQuizAttempt,
    getUserQuizzes,
    getCompletedQuizzes
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};