import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await axios('http://localhost:3000/api/courses');
      setCourses(result.data);
    };
    fetchCourses();
  }, []);

  
};

export default CourseList;
