import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Play, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';

const CompletedQuizzes: React.FC = () => {
  const { currentUser } = useAuth();
  const { getCompletedQuizzes, quizzes } = useQuiz();

  const userAttempts = getCompletedQuizzes(currentUser?.id || '');
  
  // Sort by most recent
  const sortedAttempts = [...userAttempts].sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : 'Unknown Quiz';
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold mb-2">Your Quiz History</h1>
          <p className="opacity-90">Track your progress and performance across all quizzes</p>
        </div>
        
        {sortedAttempts.length > 0 ? (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAttempts.map((attempt) => {
                    const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                    let scoreColorClass = '';
                    
                    if (percentage >= 80) {
                      scoreColorClass = 'text-green-600';
                    } else if (percentage >= 60) {
                      scoreColorClass = 'text-yellow-600';
                    } else {
                      scoreColorClass = 'text-red-600';
                    }
                    
                    return (
                      <tr key={attempt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getQuizTitle(attempt.quizId)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(attempt.completedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${scoreColorClass}`}>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {attempt.score} / {attempt.totalQuestions} ({percentage}%)
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Link 
                            to={`/play-quiz/${attempt.quizId}`}
                            className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            <span>Retry</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-purple-700" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed quizzes yet</h3>
            <p className="text-gray-500 mb-6">You haven't completed any quizzes yet. Try taking some quizzes to track your progress.</p>
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedQuizzes;