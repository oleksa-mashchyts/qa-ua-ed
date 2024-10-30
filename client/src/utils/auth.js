import axios from 'axios';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    return user; // Повертаємо користувача з роллю
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
