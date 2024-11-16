// StudentCourseList.js
import React from "react";
import { Card, CardContent, Typography, CardActions, Box, IconButton, Button, CardMedia } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const StudentCourseList = ({ courses }) => {
  const navigate = useNavigate();

  if (courses.length === 0) {
    return <Typography variant="h6">Курси відсутні.</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {courses.map((course) => (
        <Card key={course._id} sx={{ width: 480, mb: 1 }}>
          <CardMedia
            component="img"
            height="140"
            image={
              course.imageUrl ||
              "https://mui.com/static/images/cards/contemplative-reptile.jpg"
            }
            alt={course.title}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {course.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Тривалість: {course.duration} годин
            </Typography>
            <Typography variant="body2">{course.description}</Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              onClick={() => navigate(`/dashboard/courses/${course._id}`)}
            >
              Увійти до курсу
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};


export default StudentCourseList;

