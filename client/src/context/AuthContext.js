import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Ініціалізація користувача з localStorage при першому завантаженні
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  // Функція для входу
  const login = async (userCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userCredentials),
      });

      if (!response.ok) {
        throw new Error('Невдалий вхід');
      }

      const data = await response.json();

      // Зберігаємо користувача і токен в localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      setCurrentUser(data.user); // Оновлюємо стан користувача

      // Переадресація залежно від ролі користувача
      const roleRedirects = {
        admin: '/dashboard',
        teacher: '/teacher-dashboard',
        student: '/student-dashboard',
      };
      navigate(roleRedirects[data.user.role] || '/');
    } catch (error) {
      console.error('Помилка під час входу:', error);
    }
  };

  // Функція для виходу
  const logout = () => {
    // Видалення даних користувача з localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setCurrentUser(null); // Очищуємо стан користувача
    navigate('/login'); // Переадресація на сторінку входу
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

// Хук для доступу до контексту аутентифікації
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth має використовуватися всередині AuthProvider');
  }
  return context;
};
