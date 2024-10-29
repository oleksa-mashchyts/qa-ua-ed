// client/src/components/CourseList.js
import React from 'react';
import { Card, CardContent, Typography, CardActions, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from '../components/CustomButton';

const CourseList = ({ courses, onDelete, onEdit }) => {
  if (courses.length === 0) {
    return <Typography variant="h6">Курси відсутні.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {courses.map((course) => (
        <Card key={course._id} sx={{ width: 400, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {course.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Тривалість: {course.duration} годин
            </Typography>
            <Typography variant="body2">
              {course.description}
            </Typography>
          </CardContent>
          <CardActions>
          <IconButton color="primary" onClick={() => onEdit(course)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(course._id)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default CourseList;
