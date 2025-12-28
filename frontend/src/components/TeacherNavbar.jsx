import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TeacherNavbar.css';

function TeacherNavbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'teacher-nav-link active' : 'teacher-nav-link';
  };

  return (
    <nav className="teacher-navbar">
      <div className="teacher-navbar-container">
        <div className="teacher-navbar-logo">
          <Link to="/teacher">Quizzing <span>Teacher</span></Link>
        </div>

        <ul className="teacher-navbar-menu">
          <li>
            <Link to="/teacher" className={isActive('/teacher')}>
              Tổng quan
            </Link>
          </li>
          <li>
            <Link to="/teacher/organize" className={isActive('/teacher/organize')}>
              Tổ chức thi
            </Link>
          </li>
          <li>
            <Link to="/teacher/create" className={isActive('/teacher/create')}>
              Tạo bài thi
            </Link>
          </li>
        </ul>

        <div className="teacher-navbar-profile">
          <div className="profile-info">
            <span className="profile-role">Giáo viên</span>
            <span className="profile-name">Thầy giáo B</span>
          </div>
          <div className="profile-avatar">
            B
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TeacherNavbar;