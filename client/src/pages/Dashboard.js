// Dashboard.js
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Dashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const adminPages = [
    { name: 'Головна', path: 'home' },
    { name: 'Курси', path: 'courses' },
    { name: 'Студенти', path: 'students' },
    { name: 'Запитання', path: 'questions' },
    { name: 'Статистика', path: 'statistics' },
  ];

  const teacherPages = [
    { name: 'Головна', path: 'home' },
    { name: 'Мої Курси', path: 'courses' },
    { name: 'Завдання', path: 'tasks' },
  ];

  const pages = currentUser?.role === 'admin' ? adminPages : teacherPages;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Панель {currentUser?.role === 'admin' ? 'Адміністратора' : 'Вчителя'}
          </Typography>
        </Toolbar>
        <List>
          {pages.map((page) => (
            <ListItem key={page.path} disablePadding>
              <ListItemButton
                component={Link}
                to={`/dashboard/${page.path}`}
                selected={location.pathname === `/dashboard/${page.path}`}
              >
                <ListItemText primary={page.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
