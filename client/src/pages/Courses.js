import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseList from '../components/CourseList';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle 
} from '@mui/material';
import CustomModal from '../components/CustomModal';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // Стан для підтвердження видалення
  const [courseToDelete, setCourseToDelete] = useState(null); // ID курсу для видалення
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '' });
  const { isLoading, currentUser } = useAuth();

  // Завантаження курсів із сервера
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

  // Збереження курсу
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

  // Видалення курсу
  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/courses/${courseToDelete}`);
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseToDelete));
      handleCloseConfirm(); // Закриваємо діалог підтвердження
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Відкриття діалогу підтвердження
  const handleOpenConfirm = (id) => {
    setCourseToDelete(id); // Зберігаємо ID курсу
    setConfirmOpen(true); // Відкриваємо діалог
  };

  // Закриття діалогу підтвердження
  const handleCloseConfirm = () => {
    setConfirmOpen(false); // Закриваємо діалог
    setCourseToDelete(null); // Очищуємо стан
  };

  // Відкриття форми для додавання/редагування
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
      <CustomButton onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Додати курс
      </CustomButton>

      <CourseList courses={courses} onDelete={handleOpenConfirm} onEdit={handleOpen} />

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
          <CustomButton type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {isEditing ? 'Зберегти зміни' : 'Додати курс'}
          </CustomButton>
        </form>
      </CustomModal>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цей курс? Цю дію неможливо скасувати.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Ні</Button>
          <Button onClick={handleDeleteCourse} color="error" autoFocus>
            Так
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;
