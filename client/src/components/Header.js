import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Modal,
  Box,
  Switch,
  Avatar,
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
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (currentUser) {
      navigate("/profile");
    }
  };  

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              ED
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
            onClick={handleProfileClick}
          >
            {currentUser?.avatar ? (
              <Avatar src={currentUser.avatar} alt="User Avatar" /> // Відображаємо аватар
            ) : (
              <AccountCircle /> // Силует за замовчуванням
            )}
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
