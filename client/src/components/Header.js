// client/src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Головна</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/courses">Курси</Link></li>
          {currentUser ? (
            <>
              <li>Вітаємо, {currentUser.name}</li>
              <li>
                <button onClick={logout}>Вийти</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={() => setLoginOpen(true)}>Вхід</button>
              </li>
              <li>
                <button onClick={() => setRegisterOpen(true)}>Реєстрація</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Модальне вікно для входу */}
      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)}>
        <LoginForm />
      </Modal>

      {/* Модальне вікно для реєстрації */}
      <Modal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)}>
        <RegisterForm />
      </Modal>
    </header>
  );
};

export default Header;
