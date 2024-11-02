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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import CustomButton from "../components/CustomButton";

const CourseDetails = ({
  elements = [], // Значення за замовчуванням
}) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseTitle, setCourseTitle] = useState("");
  const [newElements, setNewElements] = useState(elements);
  const [newLesson, setNewLesson] = useState("");
  const [newTest, setNewTest] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`
        );
        setCourseTitle(courseResponse.data.title);

        const elementsResponse = await axios.get(
          `http://localhost:3000/api/courses/${courseId}/elements`
        );
        setNewElements(elementsResponse.data);
      } catch (error) {
        console.error("Error fetching course details or elements:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleAddLesson = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/lessons`,
        {
          title: newLesson,
          content: "Тут має бути контент уроку",
          courseId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setNewElements((prevElements) => [...prevElements, response.data]);
      setNewLesson("");
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const handleAddTest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/tests`,
        {
          title: newTest,
          questions: [],
          courseId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setNewElements((prevElements) => [...prevElements, response.data]);
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedElements = Array.from(newElements);
    const [movedElement] = reorderedElements.splice(result.source.index, 1);
    reorderedElements.splice(result.destination.index, 0, movedElement);

    setNewElements(reorderedElements);

    // Оновлюємо порядок на сервері
    try {
      await Promise.all(
        reorderedElements.map((element, index) =>
          axios.patch(
            `http://localhost:3000/api/${element.type}s/${element._id}/order`,
            {
              order: index + 1,
            }
          )
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddLesson();
          }
        }}
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTest();
          }
        }}
      />
      <CustomButton sx={{ mt: 2 }} onClick={handleAddTest}>
        Додати тест
      </CustomButton>

      <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
        Уроки та Тести
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="elements">
          {(provided) => (
            <TableContainer
              component={Paper}
              sx={{ mt: 3 }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedItems.length > 0 &&
                          selectedItems.length < newElements.length
                        }
                        checked={selectedItems.length === newElements.length}
                        onChange={(e) =>
                          e.target.checked
                            ? setSelectedItems(newElements.map((el) => el._id))
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
                  {newElements.map((element, index) => (
                    <Draggable
                      key={element._id}
                      draggableId={element._id}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedItems.includes(element._id)}
                              onChange={() => handleSelectItem(element._id)}
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            onClick={() =>
                              handleEnterItem(element._id, element.type)
                            }
                          >
                            {element.type === "lesson" ? "Урок" : "Тест"}
                          </TableCell>
                          <TableCell align="left">{element.title}</TableCell>
                          <TableCell align="left">
                            {element.completed ? "Завершений" : "В процесі"}
                          </TableCell>
                          <TableCell align="left">
                            {format(new Date(element.createdAt), "dd/MM/yyyy")}
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default CourseDetails;
