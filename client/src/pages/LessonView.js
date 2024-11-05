import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../context/AuthContext"; // Приклад отримання теми з контексту


const LessonView = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const { theme: appTheme } = useAuth(); // Отримуємо тему з хука useAuth
  const [cachedLessons, setCachedLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState(""); // Зберігаємо початковий контент
  const editorRef = useRef(null); // Створюємо ref для редактора

  

  const fetchLesson = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/lessons/${lessonId}`
      );
      setLesson(response.data);
      setNewTitle(response.data.title);
      setContent(response.data.content);
      setInitialContent(response.data.content); // Ініціалізуємо початковий контент
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  }, [lessonId]);

  const fetchCourseTitle = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/courses/${courseId}`
      );
      setCourseTitle(response.data.title);
    } catch (error) {
      console.error("Error fetching course title:", error);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLesson();
    fetchCourseTitle();
  }, [fetchLesson, fetchCourseTitle]);

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

    if (!cachedLessons.length) fetchLessons();
  }, [courseId, cachedLessons]);

  const handleSaveTitle = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/lessons/${lessonId}`,
        { title: newTitle },
        { headers: { "Content-Type": "application/json" } }
      );
      setLesson((prev) => ({ ...prev, title: newTitle }));
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Error saving title:", error);
      alert("Не вдалося зберегти нову назву.");
    }
  };

  const handleSaveContent = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/lessons/${lessonId}`,
        { content },
        { headers: { "Content-Type": "application/json" } }
      );
      setIsEditing(false);
      setInitialContent(content); // Оновлюємо початковий контент після збереження
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Не вдалося зберегти зміни контенту.");
    }
  };

  const handleCancelEdit = () => {
    if (lesson) setNewTitle(lesson.title);
    setIsEditingTitle(false);
  };

  const handleCancelContentEdit = () => {
    setContent(initialContent); // Повертаємо початковий контент
    setIsEditing(false); // Просто виходимо з режиму редагування без збереження змін у контенті
  };

  const toggleEditTitle = () => setIsEditingTitle(!isEditingTitle);
  const toggleEditContent = () => setIsEditing(!isEditing);

 // Функція завантаження зображення
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file && editorRef.current) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            "http://localhost:3001/api/uploads",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (response.data && response.data.url) {
            const imgTag = `<img src="${response.data.url}" alt="Зображення" />`;
            setContent((prevContent) => prevContent + imgTag);
          } else {
            console.error(
              "Невірний формат відповіді від сервера:",
              response.data
            );
            alert(
              "Не вдалося завантажити зображення: невірний формат відповіді"
            );
          }
        } catch (error) {
          console.error("Помилка завантаження зображення:", error);
          alert("Не вдалося завантажити зображення");
        }
      }
    };

    // Відкриваємо діалог вибору файлу
    input.click();
  };



  // Конфігурація Jodit з урахуванням теми
const editorConfig = {
  readonly: !isEditing,
  theme: appTheme === "dark" ? "dark" : "default",
  toolbarSticky: false,
  extraButtons: [
    {
      name: "uploadImage",
      iconURL: "https://img.icons8.com/material-outlined/24/000000/upload.png",
      tooltip: "Завантажити зображення",
      exec: handleImageUpload,
    },
  ],
  style: {
    backgroundColor: appTheme === "dark" ? "#262626" : "#fff",
    color: appTheme === "dark" ? "#f0f0f0" : "#000",
  },
};




  if (!lesson) {
    return <Typography>Завантаження...</Typography>; // Відображаємо повідомлення, поки lesson не завантажено
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: "240px",
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          padding: 2,
          overflowY: "auto",
          maxHeight: "100vh",
          position: "fixed",
          top: 100,
          height: "100vh",
        }}
      >
        <Typography variant="h6">Уроки:</Typography>
        <List>
          {cachedLessons.length ? (
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

      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          overflowY: "auto",
          marginLeft: "240px",
          height: "100vh",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard/courses/${courseId}`)}
          sx={{ mb: 2 }}
        >
          Назад до курсу
        </Button>
        <Typography variant="h5" gutterBottom>
          » {courseTitle}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEditingTitle ? (
              <TextField
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveTitle();
                  }
                }}
              />
            ) : (
              <Typography variant="h4">{lesson.title}</Typography>
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
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              {" "}
              {/* Новий контейнер для вирівнювання кнопок */}
              <Button variant="contained" onClick={handleSaveContent}>
                Зберегти
              </Button>
              <Button variant="outlined" onClick={handleCancelContentEdit}>
                Скасувати
              </Button>
            </Box>
          ) : (
            <Button variant="outlined" onClick={toggleEditContent}>
              Редагувати контент
            </Button>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />

        {isEditing ? (
          // Відображення редактора у режимі редагування
          <JoditEditor
            ref={editorRef}
            value={content}
            config={editorConfig}
            onBlur={(newContent) => setContent(newContent)}
          />
        ) : (
          // Відображення контенту як HTML, коли не редагується
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </Box>
    </Box>
  );
};

export default LessonView;
