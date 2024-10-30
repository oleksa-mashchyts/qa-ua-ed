import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";

const LessonView = () => {
  const { lessonId, courseId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]); // Додаємо стан для списку уроків
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/lessons/${lessonId}`
        );
        setLesson(response.data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    const fetchLessons = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/lessons/courses/${courseId}/lessons`
        );
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLesson();
    fetchLessons();
  }, [lessonId, courseId]);

  const handleSave = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/lessons/${lessonId}`,
        lesson
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving lesson:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson((prevLesson) => ({ ...prevLesson, [name]: value }));
  };

  if (!lesson) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: "240px", borderRight: "1px solid #ccc", padding: 2 }}>
        <Typography variant="h6">Уроки</Typography>
        <List>
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <ListItem key={lesson._id}>
                <ListItemButton
                  component="a"
                  href={`/dashboard/courses/${courseId}/lessons/${lesson._id}`}
                >
                  {lesson.title}
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography>Уроків ще немає.</Typography>
          )}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">{lesson.title}</Typography>
          {isEditing && (
            <Button variant="contained" onClick={handleSave}>
              Зберегти
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {isEditing ? (
          <TextField
            name="content"
            value={lesson.content}
            onChange={handleChange}
            multiline
            rows={10}
            fullWidth
          />
        ) : (
          <Typography variant="body1">{lesson.content}</Typography>
        )}

        <Button sx={{ mt: 2 }} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Скасувати" : "Редагувати"}
        </Button>
      </Box>
    </Box>
  );
};

export default LessonView;
