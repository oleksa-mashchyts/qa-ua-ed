// App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import Header from './components/Header';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <AuthProvider>
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
              <Route path="students" element={<div>Список студентів</div>} />
              <Route path="questions" element={<div>Список запитань</div>} />
              <Route path="statistics" element={<div>Статистика</div>} />
            </Route>
          </Routes>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
