import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
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
  const quillRef = useRef(null); // Створюємо реф для Quill редактора

  const [cachedLessons, setCachedLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(""); // Стан для контенту

  const fetchLesson = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/lessons/${lessonId}`
      );
      setLesson(response.data);
      setNewTitle(response.data.title);
      setContent(response.data.content); // Ініціалізуємо контент
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

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

  const cleanContent = (html) => {
    return html
      .replace(/<p><br><\/p>/g, "") // Видаляємо порожні абзаци
      .replace(/<p>(.*?)<\/p>/g, "$1<br>") // Заміна <p> на <br> для кращої сумісності
      .replace(/(<br>\s*)+$/g, ""); // Видаляємо зайві <br> в кінці
  };

  const handleSaveContent = async () => {
    const cleanedContent = cleanContent(content); // Очищений контент

    try {
      await axios.patch(
        `http://localhost:3000/api/lessons/${lessonId}`,
        { content: cleanedContent },
        { headers: { "Content-Type": "application/json" } }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Не вдалося зберегти зміни контенту.");
    }
  };

  const handleCancelEdit = () => {
    setNewTitle(lesson.title);
    setIsEditingTitle(false);
  };

  const toggleEditTitle = () => setIsEditingTitle(!isEditingTitle);

  const modules = {
    toolbar: {
      container: "#toolbar", // Вказуємо ідентифікатор для кастомної панелі
    },
    clipboard: {
      matchVisual: false, // Запобігає зайвим <p> і <br> при вставці
    },
  };

  const renderToolbar = () => (
    <div id="toolbar">
      <Tooltip title="Заголовок 1" arrow>
        <button className="ql-header" value="1" />
      </Tooltip>
      <Tooltip title="Заголовок 2" arrow>
        <button className="ql-header" value="2" />
      </Tooltip>
      <Tooltip title="Жирний" arrow>
        <button className="ql-bold" />
      </Tooltip>
      <Tooltip title="Курсив" arrow>
        <button className="ql-italic" />
      </Tooltip>
      <Tooltip title="Підкреслений" arrow>
        <button className="ql-underline" />
      </Tooltip>
      <Tooltip title="Закреслений" arrow>
        <button className="ql-strike" />
      </Tooltip>
      <Tooltip title="Цитата" arrow>
        <button className="ql-blockquote" />
      </Tooltip>
      <Tooltip title="Код-блок" arrow>
        <button className="ql-code-block" />
      </Tooltip>
      <Tooltip title="Маркерований список" arrow>
        <button className="ql-list" value="bullet" />
      </Tooltip>
      <Tooltip title="Нумерований список" arrow>
        <button className="ql-list" value="ordered" />
      </Tooltip>
      <Tooltip title="Вставити посилання" arrow>
        <button className="ql-link" />
      </Tooltip>
      <Tooltip title="Вирівнювання тексту" arrow>
        <select className="ql-align">
          <option defaultValue></option>
          <option value="center" />
          <option value="right" />
          <option value="justify" />
        </select>
      </Tooltip>
      <Tooltip title="Вибрати колір тексту" arrow>
        <select className="ql-color" />
      </Tooltip>
      <Tooltip title="Вибрати колір фону" arrow>
        <select className="ql-background" />
      </Tooltip>
      <Tooltip title="Очистити форматування" arrow>
        <button className="ql-clean" />
      </Tooltip>
      <Tooltip title="Вставити зображення" arrow>
        <button
          className="ql-image"
          onClick={() => handleFileUpload("image")}
        />
      </Tooltip>
      <Tooltip title="Вставити відео" arrow>
        <button
          className="ql-video"
          onClick={() => handleFileUpload("video")}
        />
      </Tooltip>
    </div>
  );

const handleFileUpload = (type) => {
  console.log("Функція handleFileUpload викликана з типом:", type); // Лог для перевірки
  const input = document.createElement("input");
  input.setAttribute("type", "file");

  // Дозволяємо тільки певні типи файлів
  if (type === "image") {
    input.setAttribute("accept", "image/*");
  } else if (type === "video") {
    input.setAttribute("accept", "video/*");
  }

  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res.data.url; // Отримуємо URL завантаженого файлу
      const range = quillRef.current.getEditor().getSelection();

      if (type === "image") {
        console.log("Отриманий URL від сервера:", url); // Додатковий лог для перевірки
        quillRef.current.getEditor().insertEmbed(range.index, "image", url);
      } else if (type === "video") {
        quillRef.current.getEditor().insertEmbed(range.index, "video", url);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Не вдалося завантажити файл.");
    }
  };
};

  if (!lesson) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Ліва панель зі списком уроків */}
      <Box
        sx={{
          width: "240px",
          borderRight: "1px solid #ccc",
          padding: 2,
          overflowY: "auto", // Незалежний скрол для лівої панелі
          maxHeight: "100vh",
          position: "fixed", // Фіксуємо панель
          top: 100,

          height: "100vh", // Зберігаємо повну висоту для лівої панелі
        }}
      >
        <Typography variant="h6">Уроки</Typography>
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

      {/* Основний контент уроку */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          overflowY: "auto", // Незалежний скрол для правої панелі
          marginLeft: "240px", // Відступ зліва, щоб уникнути перекриття лівою панеллю
          height: "100vh",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Заголовок уроку з можливістю редагування */}
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
              <Typography variant="h4">{lesson.title}</Typography>
            )}

            {/* Кнопки для збереження та скасування редагування заголовка */}
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

          {/* Кнопка збереження контенту */}
          {isEditing && (
            <Button variant="contained" onClick={handleSaveContent}>
              Зберегти
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Вміст уроку з підтримкою редагування */}
        {isEditing ? (
          <>
            {/* Панель інструментів для редактора */}
            {renderToolbar()}
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={modules} // Додаємо конфігурацію
              theme="snow"
              style={{ height: "400px", marginBottom: "20px" }}
            />
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}

        {/* Кнопка для перемикання між режимами редагування */}
        <Button sx={{ mt: 2 }} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Скасувати" : "Редагувати"}
        </Button>
      </Box>
    </Box>
  );
};

export default LessonView;
