import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit, 
  Eye, 
  Search,
  Filter 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { quizzes, userAttempts, updateQuiz, deleteQuiz } = useQuiz();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDrafts, setShowDrafts] = useState(true);
  const [showPublished, setShowPublished] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Filter quizzes based on search and filter settings
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      (showDrafts && !quiz.published) || 
      (showPublished && quiz.published);
    
    return matchesSearch && matchesFilter;
  });

  // Get total stats
  const totalQuizzes = quizzes.length;
  const totalAttempts = userAttempts.length;
  const totalDraftQuizzes = quizzes.filter(quiz => !quiz.published).length;
  const totalPublishedQuizzes = quizzes.filter(quiz => quiz.published).length;

  const handlePublishToggle = (id: string, currentStatus: boolean) => {
    updateQuiz(id, { published: !currentStatus });
  };

  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id);
    setConfirmDelete(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-800 to-indigo-700 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
              <p className="opacity-90">Welcome back, {currentUser?.username}!</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 shadow-sm">
              <div className="rounded-full bg-purple-100 p-3">
                <BookOpen className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-800">{totalQuizzes}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 shadow-sm">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-gray-800">{totalPublishedQuizzes}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 shadow-sm">
              <div className="rounded-full bg-yellow-100 p-3">
                <Edit className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-gray-800">{totalDraftQuizzes}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 shadow-sm">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-800">{totalAttempts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Manage Quizzes</h2>
            
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
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
              
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                <Filter className="h-5 w-5 text-gray-500" />
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={showDrafts}
                    onChange={() => setShowDrafts(!showDrafts)}
                    className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Drafts</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    checked={showPublished}
                    onChange={() => setShowPublished(!showPublished)}
                    className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Published</span>
                </label>
              </div>
            </div>
          </div>
          
          {filteredQuizzes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attempts
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuizzes.map((quiz) => {
                    const totalAttempts = userAttempts.filter(attempt => attempt.quizId === quiz.id).length;
                    
                    return (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {quiz.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {quiz.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {quiz.published ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quiz.questions.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {totalAttempts}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handlePublishToggle(quiz.id, quiz.published)}
                              className={`p-1 rounded-md ${
                                quiz.published
                                  ? 'text-yellow-700 hover:bg-yellow-100'
                                  : 'text-green-700 hover:bg-green-100'
                              }`}
                              title={quiz.published ? 'Unpublish' : 'Publish'}
                            >
                              {quiz.published ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                            </button>
                            <button
                              onClick={() => window.open(`/play-quiz/${quiz.id}`, '_blank')}
                              className="p-1 rounded-md text-blue-700 hover:bg-blue-100"
                              title="Preview"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            {confirmDelete === quiz.id ? (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleDeleteQuiz(quiz.id)}
                                  className="p-1 rounded-md text-red-700 hover:bg-red-100"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="p-1 rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(quiz.id)}
                                className="p-1 rounded-md text-red-700 hover:bg-red-100"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No quizzes found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;