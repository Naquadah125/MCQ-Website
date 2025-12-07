import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">QuizMaster</Link>
        </div>

        {/* Menu bên trái */}
        <ul className="navbar-menu">
          <li>
            <Link to="/quiz" className="nav-link">
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/features" className="nav-link">
              Tính năng
            </Link>
          </li>
          <li>
            <Link to="/partners" className="nav-link">
              Đối tác
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Liên hệ
            </Link>
          </li>
        </ul>

        {/* Nút bên phải */}
        <div className="navbar-buttons">
          <button className="btn-login">Đăng nhập</button>
          <button className="btn-signup">Đăng ký</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
