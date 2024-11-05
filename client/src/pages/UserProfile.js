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
  TextField,
} from "@mui/material";
import { PhotoCamera, Cancel as CancelIcon } from "@mui/icons-material";
import Achievements from "../components/Achievements";
import Badges from "../components/Badges";
import { useAuth } from "../context/AuthContext";

axios.defaults.baseURL = "http://localhost:3000";


const UserProfile = () => {
  const { currentUser, setCurrentUser, updateUserAvatar } = useAuth();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
      name: "",
      bio: "",
      email: "",
    });
      const [hovered, setHovered] = useState(false);
    

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${currentUser._id}/profile`
        );
        setProfile(response.data);
        setEditedProfile({
          name: response.data.name,
          bio: response.data.bio,
          email: response.data.email,
        });
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
      await axios.patch(`/api/users/${currentUser._id}/avatar`, { avatarUrl },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
       updateUserAvatar(avatarUrl); 
      setProfile((prevProfile) => ({ ...prevProfile, avatar: avatarUrl }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

    const handleEditToggle = () => {
      setIsEditing(!isEditing);
    };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile((prev) => ({ ...prev, [name]: value }));
      };

      const handleSaveProfile = async () => {
        try {
          const response = await axios.patch(
            `/api/users/${currentUser._id}/profile`,
            {
              name: editedProfile.name,
              bio: editedProfile.bio,
              email: editedProfile.email,
            }
          );
          setProfile(response.data);
          setCurrentUser((prev) => ({ ...prev, ...response.data })); // Оновлення в контексті
          setIsEditing(false);
        } catch (error) {
          console.error("Error saving profile:", error);
        }
      };

        const handleCancelEdit = () => {
          setEditedProfile({
            name: profile.name,
            bio: profile.bio,
            email: profile.email,
          });
          setIsEditing(false);
        };


  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: "auto" }}>
      {/* Шапка профілю */}
      <Paper sx={{ padding: 3, display: "flex", alignItems: "center", gap: 2 }}>
        {/* Аватар з кнопкою завантаження, яка показується при наведенні */}
        <Box
          sx={{
            position: "relative",
            width: 80,
            height: 80,
            "&:hover .avatar-hover": { opacity: 1 },
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar
            src={profile.avatar || "/path/to/default-avatar.jpg"}
            alt="User Avatar"
            sx={{ width: "100%", height: "100%", cursor: "pointer" }}
            onClick={() => document.getElementById("avatarUpload").click()}
          />
          <IconButton
            className="avatar-hover"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              opacity: 0,
              transition: "opacity 0.3s",
            }}
            onClick={() => document.getElementById("avatarUpload").click()}
          >
            <PhotoCamera />
          </IconButton>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />
        </Box>

        <Box>
          {isEditing ? (
            <TextField
              name="name"
              label="Ім'я"
              value={editedProfile.name}
              onChange={handleInputChange}
              fullWidth
            />
          ) : (
            <Typography variant="h4">{profile.name || "Користувач"}</Typography>
          )}
          <Typography variant="subtitle1" color="textSecondary">
            {currentUser.role}
          </Typography>
        </Box>

        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
              >
                Зберегти
              </Button>
              <IconButton color="secondary" onClick={handleCancelEdit}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditToggle}
            >
              Редагувати профіль
            </Button>
          )}
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Основна інформація */}
      <Paper sx={{ padding: 3, mb: 3 }}>
        <Typography variant="h6">Основна інформація</Typography>
        {isEditing ? (
          <TextField
            name="bio"
            label="Біографія"
            value={editedProfile.bio}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
        ) : (
          <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-line" }}>
            {profile.bio || "Коротка біографія користувача"}
          </Typography>
        )}
        {isEditing ? (
          <TextField
            name="email"
            label="Email"
            value={editedProfile.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ mt: 2 }}
          />
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Email: {profile.email}
          </Typography>
        )}
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
