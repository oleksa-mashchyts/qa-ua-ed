import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import jsPDF from "jspdf";

const CVView = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const userId = "{userId}"; // Замініть на актуальний ID користувача

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/profile`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSaveProfile = async () => {
    try {
      await axios.patch(`/api/users/${userId}/profile`, profile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`CV - ${profile.name}`, 10, 10);
    doc.text(`Bio: ${profile.bio}`, 10, 20);
    doc.text(`Skills: ${profile.skills?.join(", ")}`, 10, 30);
    doc.text(`Certifications: ${profile.certifications?.join(", ")}`, 10, 40);
    doc.save("CV.pdf");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">CV</Typography>

      {isEditing ? (
        <>
          <TextField
            label="Біографія"
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            fullWidth
            sx={{ my: 2 }}
          />
          <TextField
            label="Навички (через кому)"
            value={profile.skills?.join(", ") || ""}
            onChange={(e) =>
              setProfile({ ...profile, skills: e.target.value.split(",") })
            }
            fullWidth
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handleSaveProfile}>
            Зберегти
          </Button>
        </>
      ) : (
        <>
          <Typography>Біографія: {profile.bio}</Typography>
          <Typography>Навички: {profile.skills?.join(", ")}</Typography>
          <Button onClick={() => setIsEditing(true)}>Редагувати</Button>
        </>
      )}
      <Button variant="contained" sx={{ mt: 2 }} onClick={generatePDF}>
        Експортувати в PDF
      </Button>
    </Box>
  );
};

export default CVView;
