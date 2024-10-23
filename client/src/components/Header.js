import React from 'react';
import '../styles/style.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">Головна</a>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="/courses">Курси</a></li>
          <li><a href="/courses">Курси</a></li>
          <li><button className="btn">Увійти</button></li>
          <li><button className="btn">Реєстрація</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
