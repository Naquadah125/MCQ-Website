import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './StudentNavbar.css';

function StudentNavbar() {
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Học sinh' });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'student-nav-link active' : 'student-nav-link';
  };

  return (
    <nav className="student-navbar">
      <div className="student-navbar-container">
        <div className="student-navbar-logo">
          <Link to="/student">Quizzing <span>Student</span></Link>
        </div>

        <ul className="student-navbar-menu">
          <li>
            <Link to="/student" className={isActive('/student')}>
              Tổng quan
            </Link>
          </li>
          <li>
            <Link to="/student/join" className={isActive('/student/join')}>
              Tham gia thi
            </Link>
          </li>
          <li>
            <Link to="/student/history" className={isActive('/student/history')}>
              Lịch sử bài thi
            </Link>
          </li>
        </ul>

        <div className="student-navbar-profile">
          <div className="profile-info">
            <span className="profile-role">Học sinh</span>
            <span className="profile-name">{user.name}</span>
          </div>
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentNavbar;