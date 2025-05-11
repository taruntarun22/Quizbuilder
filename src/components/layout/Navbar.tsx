import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, List, Plus, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-700" />
              <span className="ml-2 text-xl font-bold text-gray-800">QuizBuilder</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center">
            {currentUser ? (
              <>
                <Link to="/" className="px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-1" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link to="/create-quiz" className="px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition">
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 mr-1" />
                    <span>Create Quiz</span>
                  </div>
                </Link>
                <Link to="/completed-quizzes" className="px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition">
                  <div className="flex items-center">
                    <List className="h-5 w-5 mr-1" />
                    <span>Completed</span>
                  </div>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-1" />
                      <span>Admin</span>
                    </div>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition">Login</Link>
                <Link to="/register" className="ml-4 px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800 transition">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser ? (
              <>
                <Link 
                  to="/" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link 
                  to="/create-quiz" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    <span>Create Quiz</span>
                  </div>
                </Link>
                <Link 
                  to="/completed-quizzes" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <List className="h-5 w-5 mr-2" />
                    <span>Completed</span>
                  </div>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      <span>Admin</span>
                    </div>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;