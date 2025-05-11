import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return currentUser ? <Navigate to={from} replace /> : <Outlet />;
};

export default PublicRoute;