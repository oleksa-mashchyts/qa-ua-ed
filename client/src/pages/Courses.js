// Courses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseList from '../components/CourseList';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/courses', newCourse);
      setNewCourse({ title: '', description: '', duration: '' });
      const response = await axios.get('http://localhost:3000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Список курсів</h2>
      <CourseList courses={courses} />

      <h2>Додати новий курс</h2>
      <form onSubmit={handleAddCourse}>
        <input
          type="text"
          name="title"
          placeholder="Назва курсу"
          value={newCourse.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Опис курсу"
          value={newCourse.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Тривалість (години)"
          value={newCourse.duration}
          onChange={handleChange}
          required
        />
        <button type="submit">Додати курс</button>
      </form>
    </div>
  );
};

export default Courses;
