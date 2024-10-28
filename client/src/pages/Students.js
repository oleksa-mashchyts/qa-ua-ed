import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Students = () => {
  const [students, setStudents] = useState([]);
  const { isLoading } = useAuth(); // Отримуємо стан завантаження

  useEffect(() => {
    if (!isLoading) { // Виконуємо запит лише після завершення завантаження
      axios.get('http://localhost:3000/api/users/students')
        .then((response) => setStudents(response.data))
        .catch((error) => console.error('Помилка завантаження студентів:', error));
    }
  }, [isLoading]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Список студентів</Typography>
      <List>
        {students.map((student) => (
          <ListItem key={student._id}>
            <ListItemText primary={student.name} secondary={student.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Students;
