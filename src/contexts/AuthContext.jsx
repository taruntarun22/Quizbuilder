import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('quizUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          if (email === 'admin@example.com' && password === 'admin123') {
            const adminUser = {
              id: 'admin-user-1',
              username: 'Admin User',
              email: 'admin@example.com',
              isAdmin: true
            };
            setCurrentUser(adminUser);
            localStorage.setItem('quizUser', JSON.stringify(adminUser));
            setLoading(false);
            resolve(adminUser);
          } else {
            const user = {
              id: 'user-' + Math.random().toString(36).substr(2, 9),
              username: email.split('@')[0],
              email,
              isAdmin: false
            };
            setCurrentUser(user);
            localStorage.setItem('quizUser', JSON.stringify(user));
            setLoading(false);
            resolve(user);
          }
        } else {
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (username, email, password) => {
    setLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && email && password) {
          const user = {
            id: 'user-' + Math.random().toString(36).substr(2, 9),
            username,
            email,
            isAdmin: false
          };
          setCurrentUser(user);
          localStorage.setItem('quizUser', JSON.stringify(user));
          setLoading(false);
          resolve(user);
        } else {
          setLoading(false);
          reject(new Error('All fields are required'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quizUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAdmin: currentUser?.isAdmin || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};