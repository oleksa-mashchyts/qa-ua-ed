import React, { useState } from 'react';

const AuthForm = ({ isLogin, onSubmit, errorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Додаємо стан для повідомлення про помилку
    const [error, setError] = useState(errorMessage);
  
    const handleSubmit = (event) => {
      event.preventDefault();

    // Проста валідація
    if (!email || !password) {
      setError('Будь ласка, заповніть всі поля');
      return;
    }

    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <button type="submit">{isLogin ? 'Увійти' : 'Зареєструватися'}</button>
    </form>
  );
};

export default AuthForm;