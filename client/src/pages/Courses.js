import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseList from '../components/CourseList';
import StudentCourseList from "../components/StudentAllCoursesList";
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CustomModal from '../components/CustomModal';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
      duration: [],
      level: [],
      skill: "",
    });
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // Стан для підтвердження видалення
  const [courseToDelete, setCourseToDelete] = useState(null); // ID курсу для видалення
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const { isLoading, currentUser, theme } = useAuth();
  const navigate = useNavigate(); // Навігація через useNavigate

    useEffect(() => {
      if (!isLoading && currentUser) {
        fetchCourses();
      }
    }, [isLoading, currentUser]);

    useEffect(() => {
      applyFilters();
    }, [filters, courses]);

    useEffect(() => {
      fetchCourses();
    }, [filters]);


    const applyFilters = () =>  {
      let filtered = courses;

if (filters.duration.length > 0) {
  filtered = filtered.filter((course) => {
    return filters.duration.some((label) => {
      const [min, max] = durationMap[label];
      return course.duration >= min && course.duration < max;
    });
  });
}

if (filters.level.length > 0) {
  filtered = filtered.filter((course) =>
    filters.level
      .map((label) => levelMap[label]) // Мапуємо рівні на англійські значення
      .includes(course.level)
  );
}


      if (filters.skill) {
        filtered = filtered.filter(
          (course) =>
            course.skills &&
            course.skills.some((skill) =>
              skill.toLowerCase().includes(filters.skill.toLowerCase())
            )
        );
      }

      setFilteredCourses(filtered);
    };
    
      const handleResetFilters = () => {
        setFilters({ duration: [], level: [], skill: "" });
      };
      


  const handleEnterCourse = (courseId) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  const durationMap = {
    "До 1 години": [0, 1],
    "1-4 години": [1, 4],
    "4-8 годин": [4, 8],
    "8-20 годин": [8, 20],
    "Більше 20 годин": [20, Infinity],
  };

  const levelMap = {
    Новачок: "novice",
    Середній: "intermediate",
    Просунутий: "advanced",
    Експерт: "expert",
    "Не зазначено": "not defined",
  };



  // Завантаження курсів із сервера
const fetchCourses = async () => {
  try {
    const params = new URLSearchParams();

    // Додаємо параметри фільтрації за тривалістю
    if (filters.duration.length > 0) {
      const durations = filters.duration
        .map((label) => durationMap[label]) // Мапуємо текстові значення у діапазони
        .flat(); // Об'єднуємо всі діапазони в один масив
      params.append("duration", JSON.stringify(durations)); // Передаємо у форматі JSON
    }

    // Додаємо параметри фільтрації за рівнем
    if (filters.level.length > 0) {
      const levels = filters.level.map((label) => levelMap[label]); // Мапуємо рівні
      params.append("level", levels.join(","));
    }

    const response = await axios.get(
      `http://localhost:3000/api/courses?${params.toString()}`
    );
    setCourses(response.data);
    setFilteredCourses(response.data);
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};




    const handleFilterChange = (category, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (category === "skill") {
          newFilters.skill = value;
        } else {
          const values = newFilters[category];
          if (values.includes(value)) {
            newFilters[category] = values.filter((v) => v !== value);
          } else {
            newFilters[category] = [...values, value];
          }
        }
        return newFilters;
      });
    };



  // Функція для оновлення зображення курсу без перезавантаження сторінки
  const handleUpdateCourseImage = (courseId, newImageUrl) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course._id === courseId ? { ...course, imageUrl: newImageUrl } : course
      )
    );
  };

  // Збереження курсу
const handleSaveCourse = async (e) => {
  e.preventDefault();
  try {
    if (isEditing) {
      const response = await axios.put(
        `http://localhost:3000/api/courses/${editingCourse._id}`,
        newCourse
      );
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === editingCourse._id ? response.data : course
        )
      );
    } else {
      const response = await axios.post(
        "http://localhost:3000/api/courses",
        newCourse
      );
      setCourses((prevCourses) => [...prevCourses, response.data]);
    }
    handleClose();
  } catch (error) {
    console.error("Error saving course:", error);
  }
};


  // Видалення курсу
  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/courses/${courseToDelete}`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseToDelete)
      );
      handleCloseConfirm(); // Закриваємо діалог підтвердження
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Відкриття діалогу підтвердження
  const handleOpenConfirm = (id) => {
    setCourseToDelete(id); // Зберігаємо ID курсу
    setConfirmOpen(true); // Відкриваємо діалог
  };

  // Закриття діалогу підтвердження
  const handleCloseConfirm = () => {
    setConfirmOpen(false); // Закриваємо діалог
    setCourseToDelete(null); // Очищуємо стан
  };

  // Відкриття форми для додавання/редагування
 const handleOpen = (course = null) => {
   if (course) {
     setIsEditing(true);
     setEditingCourse(course);
     setNewCourse({
       title: course.title,
       description: course.description,
       duration: course.duration,
       level: course.level || "not defined", // Додаємо рівень
     });
   } else {
     setIsEditing(false);
     setNewCourse({
       title: "",
       description: "",
       duration: "",
       level: "not defined", // Початкове значення
     });
   }
   setOpen(true);
 };


  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  setNewCourse((prev) => ({ ...prev, [name]: value }));
};


  return (
    <Box sx={{ display: "flex", padding: 2, gap: 2 }}>
      {/* Панель фільтрів */}
      <Box
        className="filters-panel"
        sx={{
          backgroundColor: theme === "dark" ? "#333" : "#f7f7f7",
          color: theme === "dark" ? "#fff" : "#333",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Фільтри
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1">Час проходження</Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {[
            "До 1 години",
            "1-4 години",
            "4-8 годин",
            "8-20 годин",
            "Більше 20 годин",
          ].map((label, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  onChange={() => handleFilterChange("duration", label)}
                  checked={filters.duration.includes(label)}
                />
              }
              label={label}
            />
          ))}
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Рівень
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {["Новачок", "Середній", "Просунутий", "Експерт", "Не зазначено"].map(
            (label, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    onChange={() => handleFilterChange("level", label)}
                    checked={filters.level.includes(label)}
                  />
                }
                label={label}
              />
            )
          )}
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Навички
        </Typography>
        <TextField
          value={filters.skill}
          onChange={(e) => handleFilterChange("skill", e.target.value)}
          placeholder="Введіть навичку"
          size="small"
          fullWidth
        />

        <Button
          onClick={handleResetFilters}
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
        >
          Скинути
        </Button>
        {/* Секція лічильника результатів */}
        <Box
          sx={{
            textAlign: "center",
            padding: 2,
            backgroundColor: theme === "dark" ? "#444" : "#e0e0e0",
            borderRadius: "8px",
            marginTop: "16px",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Знайдено матеріялів: {filteredCourses.length}
          </Typography>
        </Box>
      </Box>

      {/* Основна секція з курсами */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Матеріяли
        </Typography>
        {currentUser?.role === "admin" && (
          <CustomButton onClick={() => handleOpen()} sx={{ mb: 2 }}>
            Додати курс
          </CustomButton>
        )}
        {currentUser?.role === "admin" ? (
          <CourseList
            courses={filteredCourses} // Використовуємо відфільтровані курси
            onDelete={handleOpenConfirm}
            onEdit={handleOpen}
            onEnter={handleEnterCourse}
            onUpdateCourseImage={handleUpdateCourseImage}
          />
        ) : (
          <StudentCourseList courses={filteredCourses} />
        )}
        <CustomModal
          open={open}
          onClose={handleClose}
          title={isEditing ? "Редагувати курс" : "Додати новий курс"}
        >
          <form onSubmit={handleSaveCourse}>
            <TextField
              label="Назва курсу"
              name="title"
              value={newCourse.title}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Опис курсу"
              name="description"
              value={newCourse.description}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              select
              label="Рівень"
              name="level"
              value={newCourse.level || "not defined"} // Встановлення значення за замовчуванням
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              SelectProps={{ native: true }}
            >
              {[
                { value: "novice", label: "Новачок" },
                { value: "intermediate", label: "Середній" },
                { value: "advanced", label: "Просунутий" },
                { value: "expert", label: "Експерт" },
                { value: "not defined", label: "Не зазначено" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <TextField
              label="Тривалість (години)"
              name="duration"
              type="number"
              value={newCourse.duration}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <CustomButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              {isEditing ? "Зберегти зміни" : "Додати курс"}
            </CustomButton>
          </form>
        </CustomModal>

        <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
          <DialogTitle sx={{ color: "text.primary" }}>
            Підтвердження видалення
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ви впевнені, що хочете видалити цей курс? Цю дію неможливо
              скасувати.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm}>Ні</Button>
            <Button onClick={handleDeleteCourse} color="error" autoFocus>
              Так
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );

};

export default Courses;
