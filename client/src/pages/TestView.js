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
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TestView = () => {
  const { testId, courseId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [structure, setStructure] = useState([]); // Структура уроків і тестів

  const fetchTest = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tests/${testId}`
      );
      setTest(response.data);
      setNewTitle(response.data.title);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Error fetching test:", error);
    }
  }, [testId]);

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
    fetchTest();
    fetchCourseTitle();
  }, [fetchTest, fetchCourseTitle]);

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
        `http://localhost:3000/api/tests/${testId}`,
        { title: newTitle },
        { headers: { "Content-Type": "application/json" } }
      );
      setTest((prev) => ({ ...prev, title: newTitle }));
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Error saving title:", error);
      alert("Не вдалося зберегти нову назву.");
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
      setNewQuestion("");
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  const handleSaveQuestions = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/tests/${testId}`,
        { questions },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Зміни збережено.");
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Не вдалося зберегти зміни запитань.");
    }
  };

  const handleCancelEdit = () => {
    setNewTitle(test.title);
    setIsEditingTitle(false);
  };

  const toggleEditTitle = () => setIsEditingTitle(!isEditingTitle);

  if (!test) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Верхня шапка з назвою курсу */}
      <Box
        sx={{
          padding: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          zIndex: 10,
          position: "fixed",
          top: 64,

        }}
      >
        <Button
          variant="h5"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard/courses/${courseId}`)}
          sx={{ alignSelf: "flex-start", mb: 1 }}
        >
          {courseTitle}
        </Button>
      </Box>

      {/* Основна частина сторінки зі структурою курсу та контентом */}
      <Box
        sx={{ display: "flex", flexGrow: 1, height: "100%", marginTop: "0px" }}
      >
        {/* Ліва панель зі структурою курсу */}
        <Box
          sx={{
            width: "240px",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            padding: 2,
            overflowY: "auto",
            position: "relative",
            height: "100%",
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

        {/* Контент уроку або тесту */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
              <Typography variant="h4">{test.title}</Typography>
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

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Запитання
          </Typography>
          <List>
            {questions.map((question, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                {question}
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
            <TextField
              label="Нове запитання"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddQuestion();
              }}
            />
            <Tooltip title="Додати запитання">
              <IconButton onClick={handleAddQuestion} color="primary">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Button
            variant="contained"
            onClick={handleSaveQuestions}
            sx={{ mt: 3 }}
          >
            Зберегти всі зміни
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TestView;
