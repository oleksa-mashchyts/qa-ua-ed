import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import Achievements from "../components/Achievements";
import Badges from "../components/Badges";
import { useAuth } from "../context/AuthContext";

axios.defaults.baseURL = "http://localhost:3000";


const UserProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${currentUser._id}/profile`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [currentUser]);

  // Функція для завантаження аватара
  const handleAvatarUpload = async (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("type", "avatar");

    try {
      const uploadResponse = await axios.post(
        "http://localhost:3001/api/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const avatarUrl = uploadResponse.data.url;

      // Оновлення URL аватара в профілі
      await axios.patch(
        `/api/users/${currentUser._id}/avatar`,
        { avatarUrl },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setProfile((prevProfile) => ({ ...prevProfile, avatar: avatarUrl }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: "auto" }}>
      {/* Шапка профілю */}
      <Paper sx={{ padding: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={profile.avatar || "/path/to/default-avatar.jpg"}
          alt="User Avatar"
          sx={{ width: 80, height: 80 }}
        />
        <IconButton color="primary" component="label">
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleAvatarUpload}
          />
          <PhotoCamera />
        </IconButton>
        <Box>
          <Typography variant="h4">{profile.name || "Користувач"}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {currentUser.role}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: "auto" }}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Зберегти" : "Редагувати профіль"}
        </Button>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Основна інформація */}
      <Paper sx={{ padding: 3, mb: 3 }}>
        <Typography variant="h6">Основна інформація</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {profile.bio || "Коротка біографія користувача"}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Навички:</Typography>
          <List>
            {(
              profile.skills || [
                "JavaScript",
                "Manual Testing",
                "Communication",
              ]
            ).map((skill, index) => (
              <ListItem key={index}>
                <ListItemText primary={skill} />
                {/* Placeholder для рівня навичок */}
                <Typography variant="body2" color="textSecondary">
                  Рівень: ★★★☆☆
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Досягнення та бейджі */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Achievements userId={currentUser._id} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Badges userId={currentUser._id} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* План розвитку (Roadmap) */}
      <Paper sx={{ padding: 3, mb: 3 }}>
        <Typography variant="h6">План розвитку</Typography>
        {/* Roadmap компонент */}
        <List>
          <ListItem>
            <ListItemText
              primary="Hard Skills"
              secondary="JavaScript: Ознайомитись з ES6+"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Soft Skills"
              secondary="Комунікація: Покращити навички публічних виступів"
            />
          </ListItem>
        </List>
      </Paper>

      {/* CV */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">Резюме</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Натисніть для експорту у формат PDF
        </Typography>
        {/* Додайте кнопку для експорту CV */}
      </Paper>
    </Box>
  );
};

export default UserProfile;
