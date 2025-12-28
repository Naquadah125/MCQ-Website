import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TeacherNavbar.css';

function TeacherNavbar() {
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Giáo viên' });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
            <span className="profile-name">{user.name}</span>
          </div>
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TeacherNavbar;