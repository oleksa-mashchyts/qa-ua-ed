import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import CustomModal from "../components/CustomModal";
import { useAuth } from "../context/AuthContext";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentSkills, setStudentSkills] = useState([]); // Навички студента
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Діалог для навичок
  const { isLoading } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/students")
      .then((response) => setStudents(response.data))
      .catch((error) =>
        console.error("Помилка завантаження студентів:", error)
      );

    axios
      .get("http://localhost:3000/api/courses")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Помилка завантаження курсів:", error));
  }, []);

  const handleSkillStatusChange = async (skillId, newStatus) => {
    await axios.patch(`/api/users/${selectedStudent._id}/skills/${skillId}`, {
      status: newStatus,
    });
    setStudentSkills(
      studentSkills.map((skill) =>
        skill._id === skillId ? { ...skill, status: newStatus } : skill
      )
    );
  };

  const handleViewSkills = async (student) => {
    setSelectedStudent(student);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${student._id}/skills`
      );
      setStudentSkills(response.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Помилка при завантаженні навичок студента:", error);
    }
  };

  const handleAssignCourses = (student) => {
    setSelectedStudent(student);
    setSelectedCourses(student.assignedCourses || []);
    setIsModalOpen(true);
  };

  const handleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const saveAssignedCourses = () => {
    axios
      .patch(
        `http://localhost:3000/api/users/${selectedStudent._id}/assign-courses`,
        { courseIds: selectedCourses }
      )
      .then((response) => {
        setStudents(
          students.map((student) =>
            student._id === selectedStudent._id
              ? { ...student, assignedCourses: response.data.assignedCourses }
              : student
          )
        );
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Помилка призначення курсів:", error));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Список студентів
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem key={student._id}>
            <ListItemText primary={student.name} secondary={student.email} />
            <Button
              variant="outlined"
              onClick={() => handleAssignCourses(student)}
            >
              Назначити курс
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleViewSkills(student)}
              sx={{ ml: 1 }}
            >
              Навички
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Модальне вікно для призначення курсів */}
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Призначити курси"
      >
        <List>
          {courses.map((course) => (
            <ListItem
              key={course._id}
              button
              onClick={() => handleCourseSelection(course._id)}
            >
              <ListItemText primary={course.title} />
              {selectedCourses.includes(course._id) ? "✔" : ""}
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={saveAssignedCourses}>
          Зберегти
        </Button>
      </CustomModal>

      {/* Діалогове вікно для перегляду та редагування навичок студента */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Навички студента</DialogTitle>
        <DialogContent>
          {studentSkills.map((skill) => (
            <Box
              key={skill._id}
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              <ListItemText primary={skill.skillId?.name || "Без назви"} />
              <Select
                value={skill.status}
                onChange={(e) =>
                  handleSkillStatusChange(skill._id, e.target.value)
                }
                sx={{ ml: 2 }}
              >
                <MenuItem value="self-assigned">Самопризначена</MenuItem>
                <MenuItem value="confirmed">Підтверджена</MenuItem>
                <MenuItem value="pending">На розгляді</MenuItem>
              </Select>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students;
