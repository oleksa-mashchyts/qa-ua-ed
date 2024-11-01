import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Modal,
  Box,
  Switch, 
} from "@mui/material";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Header = ({ toggleTheme, isDarkMode }) => {
  const { currentUser, logout } = useAuth();
  const [isLoginOpen, setLoginOpen] = React.useState(false);
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Освітній портал
            </Link>
          </Typography>
          {currentUser ? (
            <>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                Вітаємо, {currentUser.name || "Користувачу"}!
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
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            inputProps={{ "aria-label": "toggle theme" }}
          />
          <IconButton
            size="large"
            aria-label="account of current user"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Modal open={isLoginOpen} onClose={() => setLoginOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Вхід
          </Typography>
          <LoginForm onClose={() => setLoginOpen(false)} />
        </Box>
      </Modal>

      <Modal open={isRegisterOpen} onClose={() => setRegisterOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Реєстрація
          </Typography>
          <RegisterForm onClose={() => setRegisterOpen(false)} />
        </Box>
      </Modal>
    </>
  );
};

export default Header;
