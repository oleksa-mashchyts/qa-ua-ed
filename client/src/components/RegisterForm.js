// client/src/components/RegisterForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

const RegisterForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Очищуємо помилки
    setSuccess(null); // Очищуємо повідомлення про успіх
    setLoading(true); // Вмикаємо індикатор завантаження

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка реєстрації');
      }

      setSuccess('Реєстрація успішна!');
      onClose(); // Закриваємо модальне вікно після успішної реєстрації
    } catch (error) {
      setError(error.message);
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
      <Typography variant="h5">Реєстрація</Typography>
      <TextField
        label="Ім'я"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Пароль"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? 'Реєстрація...' : 'Зареєструватися'}
      </Button>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="primary" variant="body2">
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterForm;
