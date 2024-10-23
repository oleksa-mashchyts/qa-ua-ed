// ProtectedRoute.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
  const { currentUser } = useAuth();

  // Перевіряємо, чи є користувач і чи відповідає його роль вимогам
  if (!currentUser || currentUser.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // Якщо користувач авторизований і його роль підходить, рендеримо вкладені маршрути
  return <Outlet />;
};

export default ProtectedRoute;
