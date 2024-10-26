// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  const login = async (credentials) => {
    try {
      const user = await loginUser(credentials); // Виклик з файлу auth.js
      setCurrentUser(user); // Зберігаємо користувача в стані
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }

      return user; // Повертаємо користувача як результат логіну
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error; // Кидаємо помилку для обробки в LoginForm
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
