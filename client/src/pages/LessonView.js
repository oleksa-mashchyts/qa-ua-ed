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
  const { theme: appTheme } = useAuth();
  const [cachedLessons, setCachedLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState(""); // Зберігаємо початковий контент
  const editorRef = useRef(null); // Створюємо ref для редактора
  const [structure, setStructure] = useState([]); // Структура уроків і тестів

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
    // Використання наявного маршруту для отримання структури курсу
    const fetchStructure = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/${courseId}/elements`
        );
        setStructure(response.data);
      } catch (error) {
        console.error("Error fetching course structure:", error);
      }
    };

    fetchStructure();
  }, [courseId]);

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
      setInitialContent(content);
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
    setContent(initialContent);
    setIsEditing(false);
  };

  const toggleEditTitle = () => setIsEditingTitle(!isEditingTitle);
  const toggleEditContent = () => setIsEditing(!isEditing);

  // Конфігурація Jodit з урахуванням теми
  const editorConfig = {
    readonly: !isEditing,
    theme: appTheme === "dark" ? "dark" : "default",
    toolbarSticky: false,
    extraButtons: [
      {
        name: "uploadImage",
        iconURL:
          "https://img.icons8.com/material-outlined/24/000000/upload.png",
        tooltip: "Завантажити зображення",
        exec: async () => {
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

          input.click();
        },
      },
    ],
    style: {
      backgroundColor: appTheme === "dark" ? "#262626" : "#fff",
      color: appTheme === "dark" ? "#f0f0f0" : "#000",
    },
  };

  if (!lesson) {
    return <Typography>Завантаження...</Typography>;
  }

return (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    {/* Фіксована секція з назвою курсу, яка залишається вгорі сторінки */}
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: 250,
        right: 0,
        padding: 2,
        backgroundColor: "background.paper",
        zIndex: 10,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="h5"
        onClick={() => navigate(`/dashboard/courses/${courseId}`)}
        sx={{
          cursor: "pointer",
          color: "primary.main",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {courseTitle}
      </Typography>
    </Box>

    {/* Ліва панель структури курсу, що містить список уроків і тестів */}
    <Box
      sx={{
        width: "240px",
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        padding: 2,
        overflowY: "auto",
        maxHeight: "100vh",
        position: "fixed",
        top: 150,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography variant="h6">Структура:</Typography>
      <List>
        {structure.length > 0 ? (
          structure.map((item) => (
            <ListItem key={item._id}>
              <ListItemButton
                onClick={() =>
                  navigate(
                    `/dashboard/courses/${courseId}/${
                      item.type === "lesson" ? "lessons" : "tests"
                    }/${item._id}`
                  )
                }
              >
                {item.title} {item.type === "test" ? "(Тест)" : ""}
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <Typography>Елементів структури ще немає.</Typography>
        )}
      </List>
    </Box>

    {/* Головна секція з контентом уроку, що містить назву уроку та прокручуваний контент */}
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        marginLeft: "240px",
        height: "100vh",
        paddingTop: "0px", // Відступ для фіксованого заголовка курсу
      }}
    >
      {/* Секція з назвою уроку, яка фіксується всередині області контенту */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          position: "fixed", // Зафіксовано всередині області контенту
          top: "129px", // Відступ від заголовка курсу
          left: "504px", // Відступ зліва для відповідності з навігаційною панеллю
          right: 0, // Розтягнення до правого краю
          zIndex: 9,
          display: "flex",
          justifyContent: "space-between",
          padding: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`, // Лінія для розділення
        }}
      >
        {/* Блок із заголовком уроку та іконками для редагування */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditingTitle ? (
            <TextField
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
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

        {/* Блок із кнопками для редагування контенту уроку */}
        {isEditing ? (
          <Box sx={{ display: "flex", gap: 1 }}>
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

      {/* Прокручуваний контент уроку або редактор контенту (якщо редагується) */}
      <Box sx={{ marginLeft: "20px", paddingTop: "70px" }}>
        {" "}
        {/* Відступ для компенсації фіксованої секції */}
        {isEditing ? (
          <JoditEditor
            ref={editorRef}
            value={content}
            config={editorConfig}
            onBlur={(newContent) => setContent(newContent)}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </Box>
    </Box>
  </Box>
);




};

export default LessonView;
