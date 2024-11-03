import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Avatar, Grid } from "@mui/material";

const Badges = ({ userId }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/badges`);
        setBadges(response.data);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };
    fetchBadges();
  }, [userId]);

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5">Бейджі</Typography>
      <Grid container spacing={2}>
        {badges.map((badge, index) => (
          <Grid item key={index}>
            <Avatar
              src={badge.icon}
              alt={badge.title}
              sx={{ width: 56, height: 56 }}
            />
            <Typography variant="subtitle1">{badge.title}</Typography>
            <Typography variant="caption" color="textSecondary">
              Отримано: {new Date(badge.awardedAt).toLocaleDateString()}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Badges;
