import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";

const StudentCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        console.log("Fetching course details for ID:", courseId);
        const response = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Курс не знайдено");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", padding: 2 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, maxWidth: 800, margin: "auto" }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={
            course.imageUrl ||
            "https://mui.com/static/images/cards/contemplative-reptile.jpg"
          }
          alt={course.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Тривалість: {course.duration} годин
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Навички:</strong>{" "}
            {course.skills ? course.skills.join(", ") : "Не зазначено"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Викладачі:</strong>{" "}
            {course.teachers ? course.teachers.join(", ") : "Не зазначено"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/dashboard/courses/${courseId}/lessons`)}
          >
            Увійти до курсу
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};


export default StudentCourseDetails;

