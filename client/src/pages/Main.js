import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Main = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({});
    const [counts, setCounts] = useState({
      courses: 0,
      students: 0,
      teachers: 0,
    });

  useEffect(() => {
    // Завантаження налаштувань користувача
    const fetchSettings = async () => {
      const response = await axios.get(
        `/api/users/${currentUser._id}/settings`
      );
      setSettings(response.data.settings || {});
    };

    // Завантаження кількості курсів, студентів та вчителів
    const fetchCounts = async () => {
      try {
        const [coursesRes, studentsRes, teachersRes] = await Promise.all([
          axios.get("/api/courses/count"),
          axios.get("/api/users/count/students"),
          axios.get("/api/users/count/teachers"),
        ]);

        setCounts({
          courses: coursesRes.data.count,
          students: studentsRes.data.count,
          teachers: teachersRes.data.count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchSettings();
    fetchCounts();
  }, [currentUser]);

  const cardData = [
    {
      name: "Курси",
      path: "/dashboard/courses",
      enabled: settings.courses,
      count: counts.courses,
    },
    {
      name: "Студенти",
      path: "/dashboard/students",
      enabled: settings.students,
      count: counts.students,
    },
    {
      name: "Вчителі",
      path: "/dashboard/teachers",
      enabled: settings.teachers,
      count: counts.teachers,
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
              sx={{
                width: 200,
                textDecoration: "none",
                color: "inherit",
                width: 200,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">{card.name}</Typography>
                {card.count !== undefined && (
                  <Typography variant="body2">
                    Кількість: {card.count}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
      </Box>
    </Box>
  );
};

export default Main;
