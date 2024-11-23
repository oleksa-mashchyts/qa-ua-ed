import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
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
import StudentCourses from "./pages/StudentCourses"; 
import Skills from './pages/Skills';
import StudentCourseDetails from "./pages/StudentCourseDetails";
import StudentCourseContent from "./pages/StudentCourseContent";



const App = () => {
  const { currentUser, isLoading, theme, updateUserTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && currentUser && location.pathname === "/") {
      if (currentUser.role === "student") {
        console.log("Navigating student to dashboard home");
        navigate("/dashboard/home"); // Для студента — дашборд з домашньою сторінкою
      } else {
        console.log("Navigating admin to dashboard");
        navigate("/dashboard"); // Для адміна — загальний дашборд
      }
    }
  }, [isLoading, currentUser, navigate]);

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

          {/* Для студентів — маршрут без ролі admin */}
          {currentUser?.role === "student" && (
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute role="student">
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<Main />} />
              <Route path="courses" element={<Courses />} />
              <Route path="my-courses" element={<StudentCourses />} />
              <Route
                path="courses/:courseId"
                element={<StudentCourseDetails />}
              />
              <Route
                path="courses/:courseId/content"
                element={<StudentCourseContent />}
              />

              <Route path="teachers" element={<Teachers />} />
              <Route
                path="questions"
                element={<div>Questions for Students</div>}
              />
              <Route path="settings" element={<Settings />} />
            </Route>
          )}

          {/* Для адмінів — маршрут із роллю admin */}
          {currentUser?.role === "admin" && (
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute role="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<Main />} />
              <Route path="courses" element={<Courses />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="skills" element={<Skills />} />
              <Route path="settings" element={<Settings />} />
              <Route
                path="courses/:courseId/lessons/:lessonId"
                element={<LessonView />}
              />
              <Route
                path="courses/:courseId/tests/:testId"
                element={<TestView />}
              />
              <Route path="courses/:courseId" element={<CourseDetails />} />
            </Route>
          )}

          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/roadmap" element={<RoadmapView />} />
          <Route path="/profile/cv" element={<CVView />} />
          <Route
            path="*"
            element={<Navigate to={currentUser ? "/dashboard" : "/"} />}
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;
