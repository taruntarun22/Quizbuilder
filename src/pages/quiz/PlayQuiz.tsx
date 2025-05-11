import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle, 
  XCircle,
  Flag,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz, Question } from '../../contexts/QuizContext';

const PlayQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getQuiz, saveQuizAttempt } = useQuiz();

  const quiz = getQuiz(id || '');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!quiz) {
      navigate('/');
      return;
    }
    
    // Initialize selected answers array
    setSelectedAnswers(Array(quiz.questions.length).fill(-1));
    
    // Set time limit - 60 seconds per question
    setTimeLeft(quiz.questions.length * 60);
  }, [quiz, navigate]);

  useEffect(() => {
    if (!quizStarted || showResults) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const submitQuiz = () => {
    // Calculate score
    let score = 0;
    selectedAnswers.forEach((selected, index) => {
      if (selected === quiz.questions[index].correctAnswer) {
        score++;
      }
    });
    
    // Save quiz attempt
    saveQuizAttempt({
      quizId: quiz.id,
      userId: currentUser?.id || '',
      score,
      totalQuestions: quiz.questions.length,
      answers: quiz.questions.map((question, index) => ({
        questionId: question.id,
        selectedOption: selectedAnswers[index]
      }))
    });
    
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-purple-600"
          style={{ width: `${(currentQuestion + 1) / quiz.questions.length * 100}%` }}
        ></div>
      </div>
    );
  };

  const renderQuizIntro = () => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <p className="opacity-90">{quiz.description}</p>
        </div>
        
        <div className="p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <HelpCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You are about to start a quiz with {quiz.questions.length} questions.
                  You will have {formatTime(quiz.questions.length * 60)} to complete the quiz.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center text-gray-700">
              <Flag className="h-5 w-5 mr-2 text-purple-700" />
              <span>Total questions: {quiz.questions.length}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-purple-700" />
              <span>Time limit: {formatTime(quiz.questions.length * 60)}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={startQuiz}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestion = (question: Question) => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <span className="font-medium text-gray-700">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <div className="flex items-center text-gray-700">
            <Clock className="h-5 w-5 mr-1 text-purple-700" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {renderProgressBar()}
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{question.text}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full py-3 px-4 rounded-md border text-left focus:outline-none transition ${
                  selectedAnswers[currentQuestion] === index
                    ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 mr-3 text-sm">
                    {['A', 'B', 'C', 'D'][index]}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition ${
                currentQuestion === 0
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            
            <button
              onClick={goToNextQuestion}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
              {currentQuestion < quiz.questions.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    // Calculate score
    let score = 0;
    selectedAnswers.forEach((selected, index) => {
      if (selected === quiz.questions[index].correctAnswer) {
        score++;
      }
    });
    
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold mb-2">Quiz Results</h1>
          <p className="opacity-90">{quiz.title}</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative h-40 w-40 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-purple-600 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${percentage * 2.51} 251.2`}
                  strokeDashoffset="0"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-800">
                {percentage}%
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700">
              You scored {score} out of {quiz.questions.length}
            </p>
          </div>
          
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Question Review</h2>
            
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-start">
                  {selectedAnswers[qIndex] === question.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{question.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Your answer: {selectedAnswers[qIndex] === -1 
                        ? 'Not answered' 
                        : question.options[selectedAnswers[qIndex]]}
                    </p>
                    {selectedAnswers[qIndex] !== question.correctAnswer && (
                      <p className="text-sm text-green-600 mt-1">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/completed-quizzes')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              View All Results
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showResults) {
    return renderResults();
  }

  if (!quizStarted) {
    return renderQuizIntro();
  }

  return renderQuestion(quiz.questions[currentQuestion]);
};

export default PlayQuiz;