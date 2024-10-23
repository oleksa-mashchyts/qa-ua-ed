// client/src/components/RegisterForm.js
import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    // Додати логіку відправлення даних на сервер
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>
      <div>
        <label>Ім'я:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Пароль:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <button type="submit">Зареєструватися</button>
    </form>
  );
};

export default RegisterForm;
