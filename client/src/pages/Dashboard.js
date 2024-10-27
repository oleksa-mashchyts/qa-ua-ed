// Dashboard.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

const Dashboard = () => {
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
            Адмін Панель
          </Typography>
        </Toolbar>
        <List>
          {['home', 'courses', 'students', 'questions', 'statistics'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} to={`/dashboard/${text}`}>
                <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
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
