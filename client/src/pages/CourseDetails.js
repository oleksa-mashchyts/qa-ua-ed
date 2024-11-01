import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import { format } from "date-fns";
import CustomButton from "../components/CustomButton";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams(); // Отримуємо ID курсу з URL
  const [courseTitle, setCourseTitle] = useState("");
  const [lessons, setLessons] = useState([]);
  const [tests, setTests] = useState([]); // Додаємо стан для тестів
  const [newLesson, setNewLesson] = useState("");
  const [newTest, setNewTest] = useState(""); // Додаємо стан для нового тесту
  const [selectedItems, setSelectedItems] = useState([]); // Стан для вибраних записів

  // Завантаження курсу та його уроків і тестів
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`
        );
        setCourseTitle(courseResponse.data.title);

        const lessonsResponse = await axios.get(
          `http://localhost:3000/api/lessons/courses/${courseId}/lessons`
        );
        setLessons(lessonsResponse.data);

        const testsResponse = await axios.get(
          `http://localhost:3000/api/tests/courses/${courseId}/tests`
        );
        setTests(testsResponse.data);
      } catch (error) {
        console.error("Error fetching course details or lessons/tests:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Додавання нового уроку
  const handleAddLesson = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/lessons`,
        {
          title: newLesson,
          content: "Тут має бути контент уроку",
          courseId, // Зв'язуємо урок із курсом
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // Оновлюємо список уроків
      setLessons((prevLessons) => [...prevLessons, response.data]);
      setNewLesson(""); // Очищаємо поле вводу
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  // Додавання нового тесту
  const handleAddTest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/tests`,
        {
          title: newTest,
          questions: [],
          courseId, // Зв'язуємо тест із курсом
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setTests((prevTests) => [...prevTests, response.data]);
      setNewTest("");
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  const handleEnterItem = (itemId, itemType) => {
    const path =
      itemType === "lesson"
        ? `/dashboard/courses/${courseId}/lessons/${itemId}`
        : `/dashboard/courses/${courseId}/tests/${itemId}`;
    navigate(path, { state: { courseTitle } });
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  if (!courseTitle) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {courseTitle}
      </Typography>

      <TextField
        label="Назва уроку"
        value={newLesson}
        onChange={(e) => setNewLesson(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <CustomButton sx={{ mt: 2 }} onClick={handleAddLesson}>
        Додати урок
      </CustomButton>

      <TextField
        label="Назва тесту"
        value={newTest}
        onChange={(e) => setNewTest(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <CustomButton sx={{ mt: 2 }} onClick={handleAddTest}>
        Додати тест
      </CustomButton>

      <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
        Уроки та Тести
      </Typography>

      {/* Таблиця для уроків і тестів */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedItems.length > 0 &&
                    selectedItems.length < lessons.length + tests.length
                  }
                  checked={
                    selectedItems.length === lessons.length + tests.length
                  }
                  onChange={(e) =>
                    e.target.checked
                      ? setSelectedItems([
                          ...lessons.map((lesson) => lesson._id),
                          ...tests.map((test) => test._id),
                        ])
                      : setSelectedItems([])
                  }
                />
              </TableCell>
              <TableCell align="left">Тип</TableCell>
              <TableCell align="left">Назва</TableCell>
              <TableCell align="left">Статус</TableCell>
              <TableCell align="left">Дата створення</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson._id} sx={{ cursor: "pointer" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItems.includes(lesson._id)}
                    onChange={() => handleSelectItem(lesson._id)}
                  />
                </TableCell>
                <TableCell
                  align="left"
                  onClick={() => handleEnterItem(lesson._id, "lesson")}
                >
                  Урок
                </TableCell>
                <TableCell align="left">{lesson.title}</TableCell>
                <TableCell align="left">
                  {lesson.completed ? "Завершений" : "В процесі"}
                </TableCell>
                <TableCell align="left">
                  {format(new Date(lesson.createdAt), "dd/MM/yyyy")}
                </TableCell>
              </TableRow>
            ))}
            {tests.map((test) => (
              <TableRow key={test._id} sx={{ cursor: "pointer" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItems.includes(test._id)}
                    onChange={() => handleSelectItem(test._id)}
                  />
                </TableCell>
                <TableCell
                  align="left"
                  onClick={() => handleEnterItem(test._id, "test")}
                >
                  Тест
                </TableCell>
                <TableCell align="left">{test.title}</TableCell>
                <TableCell align="left">-</TableCell>
                <TableCell align="left">
                  {format(new Date(test.createdAt), "dd/MM/yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseDetails;
