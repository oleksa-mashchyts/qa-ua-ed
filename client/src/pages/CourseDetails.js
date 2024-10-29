import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, TextField, List, ListItem } from '@mui/material';

const CourseDetails = () => {
  const { courseId } = useParams(); // Отримуємо ID курсу з URL
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState('');

  // Завантаження курсу та його уроків
  useEffect(() => {
    const fetchCourse = async () => {
      const response = await axios.get(`http://localhost:3000/api/courses/${courseId}`);
      setCourse(response.data);
      setLessons(response.data.lessons || []);
    };
    fetchCourse();
  }, [courseId]);

  // Додавання нового уроку
  const handleAddLesson = async () => {
    const response = await axios.post(`http://localhost:3000/api/lessons`, {
      title: newLesson,
      courseId,
    });
    setLessons((prevLessons) => [...prevLessons, response.data]);
    setNewLesson(''); // Очищуємо поле вводу
  };

  if (!course) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>{course.title}</Typography>

      <Typography variant="h6" gutterBottom>Уроки</Typography>
      <List>
        {lessons.map((lesson) => (
          <ListItem key={lesson._id}>{lesson.title}</ListItem>
        ))}
      </List>

      <TextField
        label="Назва уроку"
        value={newLesson}
        onChange={(e) => setNewLesson(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleAddLesson}
      >
        Додати урок
      </Button>
    </Box>
  );
};

export default CourseDetails;
