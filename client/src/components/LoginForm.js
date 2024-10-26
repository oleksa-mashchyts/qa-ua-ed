// client/src/components/LoginForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onClose }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth(); // Використовуємо контекст для входу
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(credentials); // Очікуємо результат логіну
      if (success) {
        onClose(); // Закриваємо модальне вікно тільки у випадку успіху
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 3,
        width: '100%',
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      <Typography variant="h5">Вхід</Typography>
      <TextField
        label="Email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        УВІЙТИ
      </Button>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LoginForm;
