import axios from 'axios';

// Функція для реєстрації користувача
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Функція для входу користувача
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    const { token, user } = response.data;

    // Зберігаємо токен в localStorage
    localStorage.setItem('token', token);
    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Функція для виходу
export const logoutUser = () => {
  localStorage.removeItem('token');
};
