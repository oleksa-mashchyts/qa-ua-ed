import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseList from './components/CourseList';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CourseList />} />
      </Routes>
    </Router>
  );
};

export default App;