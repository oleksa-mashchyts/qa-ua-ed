// client/src/components/CourseList.js
import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';

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
            <Button size="small" onClick={() => onEdit(course)}>
              Редагувати
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(course._id)}>
              Видалити
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default CourseList;
