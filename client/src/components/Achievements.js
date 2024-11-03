import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Achievements = ({ userId }) => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/achievements`);
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };
    fetchAchievements();
  }, [userId]);

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5">Досягнення</Typography>
      <List>
        {achievements.map((achievement, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={achievement.title}
                secondary={`Отримано: ${new Date(
                  achievement.date
                ).toLocaleDateString()}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Achievements;
