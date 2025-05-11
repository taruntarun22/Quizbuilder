import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, CheckCircle2, Award, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { quizzes, userAttempts } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes.filter(quiz => quiz.published));

  // Stats
  const totalCompletedQuizzes = userAttempts.filter(attempt => attempt.userId === currentUser?.id).length;
  const averageScore = totalCompletedQuizzes > 0 
    ? Math.round(userAttempts
        .filter(attempt => attempt.userId === currentUser?.id)
        .reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / totalCompletedQuizzes)
    : 0;
  const createdQuizzes = quizzes.filter(quiz => quiz.createdBy === currentUser?.id).length;

  useEffect(() => {
    setFilteredQuizzes(
      quizzes
        .filter(quiz => quiz.published)
        .filter(quiz => 
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [quizzes, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.username}!</h1>
          <p className="opacity-90">Take a quiz, challenge yourself, or create your own.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-white rounded-lg border border-gray-100 p-4 flex items-center space-x-4">
            <div className="rounded-full bg-purple-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Quizzes Completed</p>
              <p className="text-2xl font-bold text-gray-800">{totalCompletedQuizzes}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-4 flex items-center space-x-4">
            <div className="rounded-full bg-teal-100 p-3">
              <Award className="h-6 w-6 text-teal-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-gray-800">{averageScore}%</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-4 flex items-center space-x-4">
            <div className="rounded-full bg-orange-100 p-3">
              <Plus className="h-6 w-6 text-orange-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Quizzes Created</p>
              <p className="text-2xl font-bold text-gray-800">{createdQuizzes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Available Quizzes</h2>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{quiz.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{quiz.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                    </span>
                    <Link 
                      to={`/play-quiz/${quiz.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      <span>Play</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No quizzes found</p>
            <Link 
              to="/create-quiz"
              className="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Create a Quiz</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;