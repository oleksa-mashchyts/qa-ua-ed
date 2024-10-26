// client/src/components/LoginForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onClose }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth(); // Використовуємо контекст для входу
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Стан для індикатора завантаження

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Очищуємо попередню помилку
    setLoading(true); // Вмикаємо стан завантаження
  
    try {
      const user = await login(credentials); // Очікуємо результат логіну
      console.log('Login successful:', user); // Діагностика результату
  
      if (user) {
        onClose(); // Закриваємо модальне вікно після успіху
      }
    } catch (error) {
      console.error('Login error:', error); // Логування помилки для діагностики
      setError('Невірні облікові дані. Спробуйте ще раз.');
    } finally {
      setLoading(false); // Вимикаємо індикатор завантаження
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading} // Блокування кнопки під час завантаження
      >
        {loading ? 'Вхід...' : 'УВІЙТИ'}
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
