// StudentCourses.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import StudentCourseList from "../components/StudentCourseList";

const StudentCourses = () => {
  const { currentUser } = useAuth();
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.role === "student") {
      axios
        .get(
          `http://localhost:3000/api/users/${currentUser._id}/assigned-courses`
        )
        .then((response) => setAssignedCourses(response.data))
        .catch((error) =>
          console.error("Помилка при завантаженні призначених курсів:", error)
        );
    }
  }, [currentUser]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Мої курси
      </Typography>
      <StudentCourseList courses={assignedCourses} />
    </Box>
  );
};

export default StudentCourses;
