import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  IconButton,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";

const CourseList = ({
  courses,
  onDelete,
  onEdit,
  onEnter,
  onUpdateCourseImage,
}) => {
  const [hoveredCourseId, setHoveredCourseId] = useState(null);

  const handleImageUpload = async (event, courseId) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      const uploadResponse = await axios.post(
        "http://localhost:3001/api/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = uploadResponse.data.url;

      await axios.patch(`http://localhost:3000/api/courses/${courseId}/image`, {
        imageUrl,
      });
      // Тут можна додати логіку оновлення списку курсів або повідомлення користувача
      if (onUpdateCourseImage) {
        onUpdateCourseImage(courseId, imageUrl);
      }
    } catch (error) {
      console.error("Error uploading course image:", error);
    }
  };

  if (courses.length === 0) {
    return <Typography variant="h6">Курси відсутні.</Typography>;
  }

  

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {courses.map((course) => (
        <Card key={course._id} sx={{ width: 480, mb: 1 }}>
          <Box
            onMouseEnter={() => setHoveredCourseId(course._id)}
            onMouseLeave={() => setHoveredCourseId(null)}
            sx={{ position: "relative" }}
          >
            <CardMedia
              component="img"
              height="140"
              image={
                course.imageUrl ||
                "https://mui.com/static/images/cards/contemplative-reptile.jpg"
              }
              alt={course.title}
            />
            {hoveredCourseId === course._id && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "140px", // Встановлюємо діаметр кола, рівний висоті зображення
                  height: "140px",
                  borderRadius: "50%", // Робимо елемент круглим
                  bgcolor: "rgba(0, 0, 0, 0.6)", // Напівпрозорий чорний фон
                  color: "white",
                }}
                onClick={() =>
                  document.getElementById(`imageUpload-${course._id}`).click()
                }
              >
                <PhotoCamera />
              </IconButton>
            )}
            <input
              id={`imageUpload-${course._id}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, course._id)}
              style={{ display: "none" }}
            />
          </Box>

          <CardContent>
            <Typography variant="h5" component="div">
              {course.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Тривалість: {course.duration} годин
            </Typography>
            <Typography variant="body2">{course.description}</Typography>
          </CardContent>
          <CardActions>
            <IconButton color="default" onClick={() => onEnter(course._id)}>
              <ArrowForwardIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => onEdit(course)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(course._id)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default CourseList;
