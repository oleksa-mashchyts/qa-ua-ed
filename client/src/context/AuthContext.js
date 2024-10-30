import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // Зчитуємо тему з localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setCurrentUser(storedUser);
      fetchUserTheme(storedUser._id);
    }
    setIsLoading(false);
  }, []);

  const fetchUserTheme = async (userId) => {
    try {
          if (!userId) {
            console.error("User ID is undefined.");
            return;
          }
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`
      );
      const userTheme = response.data.theme || "light";
      setTheme(userTheme);
      localStorage.setItem("theme", userTheme); // Зберігаємо тему у localStorage
    } catch (error) {
      console.error("Error fetching user theme:", error);
    }
  };


  const updateUserTheme = async (newTheme) => {
    try {
      if (currentUser && currentUser._id) {
        await axios.patch(
          `http://localhost:3000/api/users/${currentUser._id}/theme`,
          { theme: newTheme }
        );
      }
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme); // Оновлюємо тему в localStorage
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

const login = async (credentials) => {
  try {
    const user = await loginUser(credentials); // Пряме отримання користувача
    console.log("User logged in:", user); // Лог для перевірки

   if (!user || !user._id) {
     console.error("User ID is missing.");
     throw new Error("User ID is missing.");
   }

    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    fetchUserTheme(user._id); // Отримуємо тему після входу
    navigate("/dashboard");
    return user;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setTheme("light"); // Скидаємо тему на світлу
    localStorage.setItem("theme", "light"); // Очищаємо тему з localStorage
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, login, logout, theme, updateUserTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
