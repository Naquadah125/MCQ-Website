import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import './AdminDashboard.css';

function AdminDashboard() {
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name || 'Admin');
    }
  }, []);

  return (
    <div className="admin-bg">
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Hệ thống quản trị ⚙️</h1>
          <p>Xin chào, {username}</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>Tổng người dùng</h3>
            <p className="admin-stat-number">158</p>
          </div>
          <div className="admin-stat-card">
            <h3>Giáo viên</h3>
            <p className="admin-stat-number text-purple">12</p>
          </div>
          <div className="admin-stat-card">
            <h3>Học sinh</h3>
            <p className="admin-stat-number text-blue">145</p>
          </div>
          <div className="admin-stat-card">
            <h3>Bài thi đã tạo</h3>
            <p className="admin-stat-number">45</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;