// client/src/pages/Home.js
import React from 'react';
import CourseList from '../components/CourseList';

const Home = () => {
  return (
    <div className="home">
      <h1>Головна сторінка</h1>
      <CourseList />
    </div>
  );
};

export default Home;
