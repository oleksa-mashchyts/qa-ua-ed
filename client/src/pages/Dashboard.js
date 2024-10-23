import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1>Вітаємо, {currentUser.name}!</h1>
      <p>Ви увійшли як: {currentUser.role}</p>

      {/* Тут буде відображатися контент, який залежить від ролі користувача */}
      {currentUser.role === 'admin' && <div>Панель адміністратора</div>}
      {currentUser.role === 'teacher' && <div>Панель викладача</div>}
      {currentUser.role === 'student' && <div>Панель студента</div>}
    </div>
  );
};

export default Dashboard;