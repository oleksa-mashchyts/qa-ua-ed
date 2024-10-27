// App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import Header from './components/Header';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
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
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
