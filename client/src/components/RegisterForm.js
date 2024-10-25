// client/src/components/RegisterForm.js
import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Alert } from '@mui/material';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null); // Додаємо стан для помилок
  const [success, setSuccess] = useState(false); // Стан для успішної реєстрації

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      // TODO: Додайте логіку відправлення даних на сервер
      setSuccess(true); // Встановлюємо повідомлення про успішну реєстрацію
    } catch (error) {
      setError('Помилка реєстрації. Спробуйте ще раз.'); // Відображаємо помилку
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" align="center">
          Реєстрація
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Реєстрація успішна!</Alert>}

        <TextField
          label="Ім'я"
          variant="outlined"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Пароль"
          variant="outlined"
          fullWidth
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          Зареєструватися
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterForm;
