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
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from "@mui/material/IconButton";

const LessonView = () => {
  const { lessonId, courseId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]); // Додаємо стан для списку уроків
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Стан редагування
  const [newTitle, setNewTitle] = useState(""); // Стан нової назви

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/lessons/${lessonId}`
        );
        setLesson(response.data);
        setNewTitle(response.data.title); // Ініціалізуємо початкову назву
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

        const handleTitleChange = (e) => {
          setNewTitle(e.target.value); // Оновлюємо нову назву в стані
        };

        const toggleEditTitle = () => {
          setIsEditingTitle(!isEditingTitle); // Перемикання між режимами редагування
        };

        const handleSaveTitle = async () => {
          try {
            await axios.patch(`http://localhost:3000/api/lessons/${lessonId}`, {
              title: newTitle,
            });
            setLesson((prevLesson) => ({ ...prevLesson, title: newTitle })); // Оновлюємо назву в стані
            setIsEditingTitle(false); // Повертаємо режим читання
          } catch (error) {
            console.error("Error saving title:", error);
            alert("Не вдалося зберегти нову назву. Спробуйте ще раз.");
          }
        };

        const handleCancelEdit = () => {
          setNewTitle(lesson.title); // Повертаємо попередню назву
          setIsEditingTitle(false); // Повертаємо режим читання
        };

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
    {/* Ліва панель зі списком уроків */}
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

    {/* Основна частина сторінки уроку */}
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Назва уроку з режимом редагування */}
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
          <Button variant="contained" onClick={handleSave}>
            Зберегти
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Редагування або перегляд контенту уроку */}
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
