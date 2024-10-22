import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">Головна</a>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="/courses">Курси</a></li>
          <li><a href="/login">Вхід</a></li>
          <li><a href="/register">Реєстрація</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
