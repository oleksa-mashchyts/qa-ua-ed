// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // Чекаємо, поки користувач завантажиться

  if (!currentUser) {
    console.log("User is not authenticated, redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (role && currentUser.role !== role) {
    console.log(`Role mismatch: expected ${role}, but got ${currentUser.role}`);
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
