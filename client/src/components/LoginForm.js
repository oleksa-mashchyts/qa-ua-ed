// client/src/components/LoginForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth();
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
      await login(credentials);
      alert('Login successful!');
    } catch (error) {
      console.error('Login error:', error); // Додайте цей лог для перевірки помилок
      console.log(credentials); // Переконайтеся, що всі поля заповнені правильно
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
