import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const { isLoading } = useAuth(); // Отримуємо стан завантаження

  useEffect(() => {
    if (!isLoading) { // Виконуємо запит лише після завершення завантаження
      axios.get('http://localhost:3000/api/users/teachers')
        .then((response) => setTeachers(response.data))
        .catch((error) => console.error('Помилка завантаження вчителів:', error));
    }
  }, [isLoading]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Список вчителів</Typography>
      <List>
        {teachers.map((teacher) => (
          <ListItem key={teacher._id}>
            <ListItemText primary={teacher.name} secondary={teacher.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Teachers;
