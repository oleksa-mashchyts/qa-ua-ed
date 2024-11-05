import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";

const Settings = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    courses: false,
    students: false,
    teachers: false,
    questions: false,
    statistics: false,
  });

  const [modalOpen, setModalOpen] = useState(false); // Додаємо стан для контролю модального вікна

  useEffect(() => {
    // Завантажити налаштування з сервера при завантаженні сторінки
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `/api/users/${currentUser._id}/settings`
        );
        setSettings(response.data.settings || {});
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [currentUser]);

  const handleCheckboxChange = (event) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await axios.patch(`/api/users/${currentUser._id}/settings`, { settings });
      setModalOpen(true);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Налаштування
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {" "}
        {/* Додаємо стилі */}
        {["courses", "students", "teachers", "questions", "statistics"].map(
          (option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={settings[option]}
                  onChange={handleCheckboxChange}
                  name={option}
                />
              }
              label={option.charAt(0).toUpperCase() + option.slice(1)}
            />
          )
        )}
        <CustomButton
          variant="outlined"
          color="primary"
          onClick={handleSaveSettings}
          sx={{ alignSelf: "flex-start" }}
        >
          Зберегти налаштування
        </CustomButton>
      </Box>
      <CustomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)} // Закриваємо модальне вікно при натисканні на закриття
        title=""
      >
        <Typography variant="body1">Налаштування збережено успішно!</Typography>
      </CustomModal>
    </Box>
  );
};

export default Settings;
