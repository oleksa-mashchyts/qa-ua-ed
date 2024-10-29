import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Button, TextField, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, List, ListItem 
} from '@mui/material';
import { format } from 'date-fns';

const CourseDetails = () => {
  const { courseId } = useParams(); // Отримуємо ID курсу з URL
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState('');

  // Завантаження курсу та його уроків
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Отримання курсу
        const courseResponse = await axios.get(`http://localhost:3000/api/courses/${courseId}`);
        setCourse(courseResponse.data);

        // Отримання уроків для курсу
        const lessonsResponse = await axios.get(`http://localhost:3000/api/lessons/courses/${courseId}/lessons`);
        setLessons(lessonsResponse.data);
      } catch (error) {
        console.error('Помилка при завантаженні курсу або уроків:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Додавання нового уроку
  const handleAddLesson = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/lessons`,
        {
          title: newLesson,
          content: 'Тут має бути контент уроку',
          courseId, // Зв'язуємо урок із курсом
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Оновлюємо список уроків
      setLessons((prevLessons) => [...prevLessons, response.data]);
      setNewLesson(''); // Очищаємо поле вводу
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };

  if (!course) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>{course.title}</Typography>

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

      <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Уроки</Typography>

      {/* Таблиця уроків */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell align="left">Назва</TableCell>
              <TableCell align="left">Статус</TableCell>
              <TableCell align="left">Дата створення</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson._id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell align="left">{lesson.title}</TableCell>
                <TableCell align="left">
                  {lesson.completed ? 'Завершений' : 'В процесі'}
                </TableCell>
                <TableCell align="left">
                  {format(new Date(lesson.createdAt), 'dd/MM/yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Старий список уроків (залишено для сумісності) */}
      <List sx={{ mt: 3 }}>
        {lessons.map((lesson) => (
          <ListItem key={lesson._id}>{lesson.title}</ListItem>
        ))}
      </List>


    </Box>
  );
};

export default CourseDetails;
