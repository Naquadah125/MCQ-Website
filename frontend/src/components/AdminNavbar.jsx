import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin' });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'admin-nav-link active' : 'admin-nav-link';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
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

        <div 
          className="admin-navbar-profile" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="profile-info">
            <span className="profile-role">Administrator</span>
            <span className="profile-name">{user.name}</span>
          </div>
          <div className="profile-avatar">
            A
          </div>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleLogout}>
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;