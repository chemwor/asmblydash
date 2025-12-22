import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../auth/getCurrentUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = getCurrentUser();

  // If no user is logged in, redirect to sign-in
  if (!user) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
