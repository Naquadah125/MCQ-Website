import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Quizzing</Link>
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="nav-link">
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/features" className="nav-link">
              Tính năng
            </Link>
          </li>
          <li>
            <Link to="/history" className="nav-link">
              Lịch sử
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Liên hệ
            </Link>
          </li>
        </ul>

        <div className="navbar-buttons">
          <button className="btn-login" onClick={() => navigate('/login')}>
            Đăng nhập
          </button>
          <button className="btn-signup" onClick={() => navigate('/signup')}>
            Đăng ký
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;