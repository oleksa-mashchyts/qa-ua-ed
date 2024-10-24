import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Button } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container>
        <Header />
        <Button onClick={toggleTheme} variant="contained" sx={{ margin: '20px 0' }}>
          Перемкнути тему
        </Button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
    </ThemeProvider>
  );
};

export default App;
