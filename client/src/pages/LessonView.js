import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const LessonView = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();

  // Стан для збереження списку уроків та поточного уроку
  const [cachedLessons, setCachedLessons] = useState([]);
  const [lesson, setLesson] = useState(null);

  // Локальний стан для редагування назви уроку
  const [newTitle, setNewTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Функція для завантаження уроку за його ID
  const fetchLesson = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/lessons/${lessonId}`
      );
      setLesson(response.data);
      setNewTitle(response.data.title);
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  }, [lessonId]);

  // Завантажуємо урок при зміні `lessonId`
  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  // Завантажуємо список уроків лише один раз
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/lessons/courses/${courseId}/lessons`
        );
        setCachedLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    if (!cachedLessons || cachedLessons.length === 0) {
      fetchLessons();
    }
  }, [courseId, cachedLessons]);

    // Функція для збереження тільки назви уроку
const handleSaveTitle = async () => {
  console.log("Saving lesson title..."); // Лог для перевірки
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/lessons/${lessonId}`,
      { title: newTitle },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Response:", response.data); // Лог для перевірки відповіді

    setLesson((prevLesson) => ({
      ...prevLesson,
      title: newTitle,
    }));

    setIsEditingTitle(false); // Вихід з режиму редагування
  } catch (error) {
    console.error("Error saving lesson title:", error);
    alert("Не вдалося зберегти нову назву.");
  }
};

const handleSaveContent = async () => {
  console.log("Saving lesson content..."); // Лог для перевірки
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/lessons/${lessonId}`,
      { content: lesson.content },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Response:", response.data); // Лог для перевірки відповіді

    setIsEditing(false); // Вихід з режиму редагування
  } catch (error) {
    console.error("Error saving lesson content:", error);
    alert("Не вдалося зберегти зміни контенту.");
  }
};


  // Функція для скасування редагування назви
  const handleCancelEdit = () => {
    setNewTitle(lesson.title); // Відновлюємо початкову назву
    setIsEditingTitle(false); // Виходимо з режиму редагування
  };

  // Функція для перемикання режиму редагування
  const toggleEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  if (!lesson) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Ліва панель зі списком уроків */}
      <Box sx={{ width: "240px", borderRight: "1px solid #ccc", padding: 2 }}>
        <Typography variant="h6">Уроки</Typography>
        <List>
          {cachedLessons && cachedLessons.length > 0 ? (
            cachedLessons.map((lesson) => (
              <ListItem key={lesson._id}>
                <ListItemButton
                  onClick={() =>
                    navigate(
                      `/dashboard/courses/${courseId}/lessons/${lesson._id}`
                    )
                  }
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

      {/* Основна частина сторінки уроку */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Назва уроку з можливістю редагування */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEditingTitle ? (
              <TextField
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {lesson.title}
              </Typography>
            )}

            {isEditingTitle ? (
              <>
                <IconButton onClick={handleSaveTitle} color="primary">
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancelEdit} color="secondary">
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={toggleEditTitle}>
                <EditIcon />
              </IconButton>
            )}
          </Box>

          {/* Кнопка для збереження контенту */}
          {isEditing && (
            <Button variant="contained" onClick={handleSaveContent}>
              Зберегти
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Контент уроку */}
        {isEditing ? (
          <TextField
            name="content"
            value={lesson.content}
            onChange={(e) =>
              setLesson((prevLesson) => ({
                ...prevLesson,
                content: e.target.value,
              }))
            }
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
