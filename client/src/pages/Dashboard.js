// Dashboard.js
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  ListItemIcon,
  CssBaseline,
  Divider,
  Toolbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import HelpIcon from "@mui/icons-material/Help";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

const drawerWidth = 240;
const collapsedWidth = 60;

const Dashboard = () => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const [isDrawerOpen, setDrawerOpen] = useState(true);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const adminPages = [
    { name: "Головна", path: "home", icon: <HomeIcon /> },
    { name: "Курси", path: "courses", icon: <SchoolIcon /> },
    { name: "Студенти", path: "students", icon: <PeopleIcon /> },
    { name: "Вчителя", path: "teachers", icon: <PeopleIcon /> },
    { name: "Запитання", path: "questions", icon: <HelpIcon /> },
    { name: "Статистика", path: "statistics", icon: <BarChartIcon /> },
  ];

  const teacherPages = [
    { name: "Головна", path: "home", icon: <HomeIcon /> },
    { name: "Мої Курси", path: "courses", icon: <SchoolIcon /> },
    { name: "Завдання", path: "tasks", icon: <BarChartIcon /> },
  ];

  const pages = currentUser?.role === "admin" ? adminPages : teacherPages;

return (
  <Box sx={{ display: "flex" }}>
    <CssBaseline />

    {/* Бічна панель з підтримкою мінімальної ширини */}
    <Drawer
      variant="permanent"
      sx={{
        width: isDrawerOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isDrawerOpen ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          marginTop: "64px", // Висота хедера, щоб Drawer починався під ним
          display: "flex", // Додаємо для горизонтального вирівнювання
          alignItems: "center", // Вирівнювання елементів по центру вертикально
        },
      }}
      open={isDrawerOpen}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isDrawerOpen ? "space-between" : "center",
          width: "100%",
          px: 1,
        }}
      >
        <Typography variant="h6" noWrap sx={{ marginLeft: 1 }}>
          {isDrawerOpen &&
            `Панель ${currentUser?.role === "admin" ? "Адміна" : "Вчителя"}`}
        </Typography>

        <IconButton
          onClick={() => setDrawerOpen(!isDrawerOpen)}
          sx={{
            borderRadius: "0%",
            padding: 1,
            marginLeft: "auto", // Зміщення кнопки праворуч при відкритій панелі
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={page.name} placement="right" disableHoverListener={isDrawerOpen}>
            <ListItemButton
              component={Link}
              to={`/dashboard/${page.path}`}
              selected={location.pathname === `/dashboard/${page.path}`}
              sx={{
                minHeight: 48,
                justifyContent: isDrawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isDrawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {page.icon}
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary={page.name} />}
            </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>

    {/* Основний контент */}
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedWidth}px)`,
        transition: theme.transitions.create("margin-left", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar />
      <Outlet />
    </Box>
  </Box>
);
};

export default Dashboard;
