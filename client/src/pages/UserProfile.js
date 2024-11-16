import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
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
import { Add, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

axios.defaults.baseURL = "http://localhost:3000";

const UserProfile = () => {
  const theme = useTheme();
  const { currentUser, setCurrentUser, updateUserAvatar } = useAuth();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    bio: "",
    email: "",
  });
  const [hovered, setHovered] = useState(false);
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillId: "", type: "" });
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [initialSkills, setInitialSkills] = useState([]);

  // Завантаження профілю користувача та початкових даних
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${currentUser._id}/profile`
        );
        setProfile(response.data);
        setSkills(response.data.skills);
        setInitialSkills(response.data.skills); // Зберігаємо початкові навички
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

    // Завантаження активних навичок для вибору
    const fetchSkills = async () => {
      try {
        const response = await axios.get("/api/skills?status=active");
        setAllSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, [currentUser]);

  // Обробка вибору навички
  const handleSkillSelect = (skillId) => {
    const selectedSkill = allSkills.find((skill) => skill._id === skillId);
    setNewSkill({
      skillId: skillId,
      type: selectedSkill ? selectedSkill.type : "",
    });
  };

  // Додавання нової навички зі статусом "самопризначена"
const handleAddSkill = async () => {
  try {
    const response = await axios.post(`/api/users/${currentUser._id}/skills`, {
      skillId: newSkill.skillId,
      type: newSkill.type,
      status: "self-assigned",
    });

    // Знайти повний об'єкт навички з `allSkills` за її ID
    const addedSkill = allSkills.find(
      (skill) => skill._id === newSkill.skillId
    );

    // Додати повний об'єкт навички (з назвою) в стан `skills`
    setSkills([...skills, { ...response.data, skillId: addedSkill }]);

    setIsDialogOpen(false);
  } catch (error) {
    console.error("Помилка при додаванні навички:", error);
  }
};

  
  // Оновлення аватара користувача
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
      await axios.patch(`/api/users/${currentUser._id}/avatar`, { avatarUrl });
      updateUserAvatar(avatarUrl);
      setProfile((prevProfile) => ({ ...prevProfile, avatar: avatarUrl }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  // Перемикач режиму редагування
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Збереження профілю користувача після редагування
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
      setCurrentUser((prev) => ({ ...prev, ...response.data }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

    const handleDeleteSkill = (skillId) => {
      setSkills(skills.filter((skill) => skill.skillId._id !== skillId));
    };

    const handleSaveSkills = async () => {
      try {
        await axios.patch(`/api/users/${currentUser._id}/profile`, { skills });
        setInitialSkills(skills); // Оновлюємо початковий стан після збереження
        setIsEditingSkills(false);
      } catch (error) {
        console.error("Error saving skills:", error);
      }
    };

  // Відміна редагування профілю
  const handleCancelEdit = () => {
    setEditedProfile({
      name: profile.name,
      bio: profile.bio,
      email: profile.email,
    });
    setIsEditing(false);
  };

    const handleCancelSkillsEdit = () => {
      setSkills(initialSkills); // Відновлюємо початковий стан навичок
      setIsEditingSkills(false);
    };

  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: "auto", mt: 10 }}>
      {/* Шапка профілю */}
      <Paper sx={{ padding: 3, display: "flex", alignItems: "center", gap: 2 }}>
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

      {/* Відображення та додавання навичок */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Навички</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {skills.map((skill) => (
            <Chip
              key={skill._id}
              label={skill.skillId.name}
              onDelete={
                isEditingSkills
                  ? () => handleDeleteSkill(skill.skillId._id)
                  : undefined
              }
              deleteIcon={isEditingSkills ? <Close /> : undefined}
              sx={{
                backgroundColor:
                  skill.status === "self-assigned"
                    ? theme.palette.info.light
                    : skill.status === "confirmed"
                    ? theme.palette.success.light
                    : theme.palette.warning.light,
                color: theme.palette.getContrastText(
                  skill.status === "self-assigned"
                    ? theme.palette.info.light
                    : skill.status === "confirmed"
                    ? theme.palette.success.light
                    : theme.palette.warning.light
                ),
                cursor: isEditingSkills ? "pointer" : "default",
              }}
            />
          ))}
          {isEditingSkills && (
            <Chip
              label="+"
              onClick={() => setIsDialogOpen(true)}
              sx={{
                backgroundColor: "#e0e0e0",
                color: "black",
                cursor: "pointer",
              }}
            />
          )}
        </Box>
        {isEditingSkills ? (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSkills}
              sx={{ mr: 1 }}
            >
              Зберегти
            </Button>
            <Button variant="outlined" onClick={handleCancelSkillsEdit}>
              Відміна
            </Button>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={() => setIsEditingSkills(true)}
            sx={{ mt: 1 }}
          >
            Редагувати
          </Button>
        )}
      </Box>

      {/* Діалогове вікно для додавання навички */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Додати навичку</DialogTitle>
        <DialogContent>
          <Select
            value={newSkill.skillId}
            onChange={(e) => handleSkillSelect(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {allSkills.map((skill) => {
              const isAdded = skills.some((s) => s.skillId._id === skill._id);
              return (
                <MenuItem key={skill._id} value={skill._id} disabled={isAdded}>
                  {isAdded ? `(додано) ${skill.name}` : skill.name}
                </MenuItem>
              );
            })}
          </Select>

          {/* Поле для відображення типу навички */}
          <TextField
            label="Тип навички"
            value={newSkill.type === "hard" ? "Hard Skill" : "Soft Skill"}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Скасувати</Button>
          <Button
            variant="contained"
            onClick={handleAddSkill}
            disabled={!newSkill.skillId}
          >
            Додати
          </Button>
        </DialogActions>
      </Dialog>

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
      </Paper>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
};

export default UserProfile;
