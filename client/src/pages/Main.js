import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Main = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    // Завантаження налаштувань користувача
    const fetchSettings = async () => {
      const response = await axios.get(
        `/api/users/${currentUser._id}/settings`
      );
      setSettings(response.data.settings || {});
    };
    fetchSettings();
  }, [currentUser]);

  const cardData = [
    { name: "Курси", path: "/dashboard/courses", enabled: settings.courses },
    {
      name: "Студенти",
      path: "/dashboard/students",
      enabled: settings.students,
    },
    {
      name: "Вчителі",
      path: "/dashboard/teachers",
      enabled: settings.teachers,
    },
    {
      name: "Запитання",
      path: "/dashboard/questions",
      enabled: settings.questions,
    },
    {
      name: "Статистика",
      path: "/dashboard/statistics",
      enabled: settings.statistics,
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Панель приладів</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        {cardData
          .filter((card) => card.enabled)
          .map((card) => (
            <Card
              key={card.name}
              component={Link}
              to={card.path}
              sx={{ width: 200, textDecoration: "none", color: "inherit" }}
            >
              <CardContent>
                <Typography variant="h6">{card.name}</Typography>
              </CardContent>
            </Card>
          ))}
      </Box>
    </Box>
  );
};

export default Main;
