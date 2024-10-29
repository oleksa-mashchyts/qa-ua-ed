import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseList from '../components/CourseList';
import { useAuth } from '../context/AuthContext'; 
import { Box, Button, TextField, Typography } from '@mui/material';
import CustomModal from '../components/CustomModal';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  const [editingCourse, setEditingCourse] = useState(null); 
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '' });
  const { isLoading, currentUser } = useAuth(); 

  // Функція для завантаження курсів
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (!isLoading && currentUser) {
      fetchCourses(); 
    }
  }, [isLoading, currentUser]);

  // Збереження нового або відредагованого курсу
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await axios.put(
          `http://localhost:3000/api/courses/${editingCourse._id}`,
          newCourse
        );
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editingCourse._id ? response.data : course
          )
        );
      } else {
        const response = await axios.post('http://localhost:3000/api/courses', newCourse);
        setCourses((prevCourses) => [...prevCourses, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/courses/${id}`);
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleOpen = (course = null) => {
    if (course) {
      setIsEditing(true);
      setEditingCourse(course);
      setNewCourse({
        title: course.title,
        description: course.description,
        duration: course.duration,
      });
    } else {
      setIsEditing(false);
      setNewCourse({ title: '', description: '', duration: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Список курсів</Typography>
      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Додати курс
      </Button>

      <CourseList courses={courses} onDelete={handleDeleteCourse} onEdit={handleOpen} />

      <CustomModal
        open={open}
        onClose={handleClose}
        title={isEditing ? 'Редагувати курс' : 'Додати новий курс'}
      >
        <form onSubmit={handleSaveCourse}>
          <TextField
            label="Назва курсу"
            name="title"
            value={newCourse.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Опис курсу"
            name="description"
            value={newCourse.description}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Тривалість (години)"
            name="duration"
            type="number"
            value={newCourse.duration}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {isEditing ? 'Зберегти зміни' : 'Додати курс'}
          </Button>
        </form>
      </CustomModal>
    </Box>
  );
};

export default Courses;
