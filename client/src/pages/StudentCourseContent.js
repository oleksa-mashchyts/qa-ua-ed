import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";

const StudentCourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("");
  const [structure, setStructure] = useState([]);
  const theme = useTheme();
  const [course, setCourse] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Отримуємо заголовок курсу
        const courseResponse = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`
        );
        setCourseTitle(courseResponse.data.title);

        // Отримуємо структуру курсу
        const structureResponse = await axios.get(
          `http://localhost:3000/api/courses/${courseId}/elements`
        );
        setStructure(structureResponse.data);

        // Вибираємо перший елемент за замовченням
        if (structureResponse.data.length > 0) {
          setSelectedContent(structureResponse.data[0]);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleContentSelect = (item) => {
    setSelectedContent(item);
  };



  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f7f7f7" }}>
      {/* Ліва панель */}
      <Box
        sx={{
          width: "20%",
          backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f7f7f7", // Тема
          color: theme.palette.text.primary, // Текст
          padding: 2,
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {courseTitle}
        </Typography>
        <List>
          {structure.map((item) => (
            <ListItem key={item._id}>
              <ListItemButton
                onClick={() => handleContentSelect(item)}
                selected={selectedContent?._id === item._id}
              >
                <Typography>
                  {item.title} {item.type === "test" ? "(Тест)" : ""}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Основна секція */}
      <Box
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f7f7f7", // Тема
          color: theme.palette.text.primary, // Текст
          flexGrow: 1,
          padding: 4,
          overflowY: "auto",
        }}
      >
        {/* Шапка */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Повернутися
          </Button>
          <Typography variant="h5">
            {selectedContent?.title || "Контент"}
          </Typography>
        </Box>

        {/* Контент */}
        {selectedContent ? (
          <Box>
            {selectedContent.type === "lesson" ? (
              <Box
                sx={{ fontSize: "16px", lineHeight: "1.6" }}
                dangerouslySetInnerHTML={{
                  __html:
                    selectedContent.content ||
                    "<p>Контент уроку недоступний</p>",
                }}
              />
            ) : selectedContent.type === "test" ? (
              <Box>
                <Typography variant="h6">Питання:</Typography>
                {selectedContent.questions?.length > 0 ? (
                  <ul>
                    {selectedContent.questions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                ) : (
                  <Typography>Питань немає</Typography>
                )}
              </Box>
            ) : (
              <Typography>Тип контенту не підтримується</Typography>
            )}
          </Box>
        ) : (
          <Typography>Виберіть контент зліва</Typography>
        )}
      </Box>
    </Box>
  );
};

export default StudentCourseContent;
