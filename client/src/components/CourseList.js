// client/src/components/CourseList.js
import React from 'react';
import { Card, CardContent, Typography, Grid, CardActions, Button } from '@mui/material';

const CourseList = ({ courses }) => {
  if (courses.length === 0) {
    return <Typography variant="h6">Курси відсутні.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <Card 
            elevation={3} 
            sx={{
              borderRadius: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <CardContent>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontWeight: 'bold', marginBottom: '8px' }}
              >
                {course.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ marginBottom: '16px' }}
              >
                {course.description}
              </Typography>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
              >
                Тривалість: {course.duration} годин
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined">
                Детальніше
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseList;
