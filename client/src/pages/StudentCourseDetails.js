import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const StudentCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
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

  const sectionTitleStyle = {
    color: theme.palette.text.primary,
    marginBottom: "16px",
  };


  return (
    <Box
      className="course-details-container"
      sx={{
        padding: 4,
        backgroundColor: theme.palette.background.default, // Використовуємо тему
        color: theme.palette.text.primary, // Використовуємо текст із теми
      }}
    >
      {/* Загальна інформація про курс */}
      <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
        <Card>
          <CardMedia
            className="course-image"
            component="img"
            sx={{
              width: "100%",
              objectFit: "cover",
            }}
            image={course.imageUrl || "https://via.placeholder.com/300"}
            alt={course.title}
          />
        </Card>
        <Box>
          <Typography variant="h4" sx={sectionTitleStyle}>
            {course.title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.secondary }}
          >
            Тривалість: {course.duration} годин
          </Typography>
          <Typography variant="body1">{course.description}</Typography>
          <Button
            variant="outlined"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => navigate(`/dashboard/courses/${courseId}/content`)}
          >
            Почати навчання
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4, backgroundColor: theme.palette.divider }} />

      {/* Секція "Ви вдосконалите" */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={sectionTitleStyle}>
          Ви вдосконалите:
        </Typography>
        {course.skills && course.skills.length > 0 ? (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
            {course.skills.map((skill, index) => (
              <Box
                key={index}
                sx={{
                  padding: 1,
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
                  borderRadius: "4px",
                  color: theme.palette.text.primary,
                }}
              >
                {skill.name} {/* Відображаємо назву навички */}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>Навички не зазначено</Typography>
        )}
      </Box>

      <Divider sx={{ my: 4, backgroundColor: theme.palette.divider }} />

      {/* Секція "Викладачі" */}
      <Box>
        <Typography variant="h5" sx={sectionTitleStyle}>
          Викладачі:
        </Typography>
        {course.teachers ? (
          <Box sx={{ mt: 2 }}>
            {course.teachers.map((teacher, index) => (
              <Typography key={index}>{teacher}</Typography>
            ))}
          </Box>
        ) : (
          <Typography>Викладачів не зазначено</Typography>
        )}
      </Box>
    </Box>
  );
};



export default StudentCourseDetails;

