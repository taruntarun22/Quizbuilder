import { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [userAttempts, setUserAttempts] = useState([]);

  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    const savedAttempts = localStorage.getItem('quizAttempts');
    
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    } else {
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

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quizAttempts', JSON.stringify(userAttempts));
  }, [userAttempts]);

  const getQuiz = (id) => {
    return quizzes.find(quiz => quiz.id === id);
  };

  const createQuiz = (quiz) => {
    const newQuiz = {
      ...quiz,
      id: 'quiz-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
  };

  const updateQuiz = (id, updates) => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.id === id ? { ...quiz, ...updates } : quiz
      )
    );
  };

  const deleteQuiz = (id) => {
    setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== id));
  };

  const saveQuizAttempt = (attempt) => {
    const newAttempt = {
      ...attempt,
      id: 'attempt-' + Math.random().toString(36).substr(2, 9),
      completedAt: new Date().toISOString()
    };
    setUserAttempts(prevAttempts => [...prevAttempts, newAttempt]);
  };

  const getUserQuizzes = (userId) => {
    return quizzes.filter(quiz => quiz.createdBy === userId);
  };

  const getCompletedQuizzes = (userId) => {
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