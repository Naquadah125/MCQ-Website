import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Admin' });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'admin-nav-link active' : 'admin-nav-link';
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-logo">
          <Link to="/admin">Quizzing <span>Admin</span></Link>
        </div>

        <ul className="admin-navbar-menu">
          <li>
            <Link to="/admin" className={isActive('/admin')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/create-user" className={isActive('/admin/create-user')}>
              Tạo User
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={isActive('/admin/users')}>
              Quản Lý User
            </Link>
          </li>
        </ul>

        <div className="admin-navbar-profile">
          <div className="profile-info">
            <span className="profile-role">Administrator</span>
            <span className="profile-name">{user.name}</span>
          </div>
          <div className="profile-avatar">
            A
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;