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
import CourseDetails from './pages/CourseDetails';
import { useAuth } from './context/AuthContext';
import LessonView from './pages/LessonView';
import TestView from "./pages/TestView";
import UserProfile from "./pages/UserProfile";
import Main from "./pages/Main";
import Settings from "./pages/Settings";
import RoadmapView from "./components/RoadmapView";
import CVView from "./components/CVView";


const App = () => {
  const { currentUser, isLoading, theme, updateUserTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Current User:", currentUser); // Лог для перевірки користувача
    if (!isLoading && currentUser && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [isLoading, currentUser, location.pathname, navigate]);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    updateUserTheme(newTheme); // Оновлюємо тему користувача
  };

  const appliedTheme = theme === "dark" ? darkTheme : lightTheme;


  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <Header toggleTheme={handleToggleTheme} isDarkMode={theme === "dark"} />
      <Box sx={{ height: "100vh" }}>
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
            <Route path="home" element={<Main />} />{" "}
            {/* Відображення Main.js */}
            <Route path="courses" element={<Courses />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="courses/:courseId/lessons/:lessonId"
              element={<LessonView />}
            />
            <Route
              path="courses/:courseId/tests/:testId"
              element={<TestView />}
            />
            {/* Новий маршрут для сторінки деталей курсу */}
            <Route path="courses/:courseId" element={<CourseDetails />} />
          </Route>
          {/* Редирект на дашборд або головну залежно від авторизації */}
          <Route
            path="*"
            element={<Navigate to={currentUser ? "/dashboard" : "/"} />}
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/roadmap" element={<RoadmapView />} />
          <Route path="/profile/cv" element={<CVView />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;
