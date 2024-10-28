// App.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box } from '@mui/material';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import Header from './components/Header';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import { useAuth } from './context/AuthContext';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { currentUser, isLoading } = useAuth(); // Додаємо isLoading
  const navigate = useNavigate();
  const location = useLocation(); // Додаємо location для перевірки шляху

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Виконуємо редирект лише після того, як користувач завантажився
  useEffect(() => {
    if (!isLoading && currentUser && location.pathname === '/') {
      navigate('/dashboard'); // Перенаправляємо на дашборд
    }
  }, [isLoading, currentUser, location.pathname, navigate]);

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Box sx={{ height: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute role="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Typography variant="h5">Головна</Typography>} />
            <Route path="courses" element={<Courses />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>
          <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"} />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;
