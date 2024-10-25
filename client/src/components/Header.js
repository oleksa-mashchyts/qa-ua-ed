// client/src/components/Header.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Modal, 
  Box, 
  IconButton, 
  Switch 
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Іконки для тем
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { ColorModeContext } from '../theme'; // Контекст для перемикання теми

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Header = ({ toggleTheme, isDarkMode }) => {
  const { currentUser, logout } = useAuth();
  const [isLoginOpen, setLoginOpen] = React.useState(false);
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);

  // Використовуємо контекст теми
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Головна
            </Link>
          </Typography>

          <Button color="inherit" component={Link} to="/courses">
            Курси
          </Button>

          {currentUser ? (
            <>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                Вітаємо, {currentUser.name}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Вийти
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => setLoginOpen(true)}>
                Вхід
              </Button>
              <Button color="inherit" onClick={() => setRegisterOpen(true)}>
                Реєстрація
              </Button>
            </>
          )}

          {/* Перемикач теми */}
          <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          inputProps={{ 'aria-label': 'toggle theme' }}
        />
        </Toolbar>
      </AppBar>

      {/* Модальне вікно для входу */}
      <Modal open={isLoginOpen} onClose={() => setLoginOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Вхід
          </Typography>
          <LoginForm />
        </Box>
      </Modal>

      {/* Модальне вікно для реєстрації */}
      <Modal open={isRegisterOpen} onClose={() => setRegisterOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Реєстрація
          </Typography>
          <RegisterForm />
        </Box>
      </Modal>
    </>
  );
};

export default Header;
