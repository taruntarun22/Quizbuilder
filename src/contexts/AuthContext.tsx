import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('quizUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation - in a real app, this would be an API call
        if (email && password) {
          // Demo admin user
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
            // Demo regular user
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

  const register = async (username: string, email: string, password: string): Promise<User> => {
    setLoading(true);
    
    // Simulate API call
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