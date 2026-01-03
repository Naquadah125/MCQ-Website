import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminFeatures from './AdminFeatures';
import './AdminDashboard.css';

function AdminDashboard() {
  const [username, setUsername] = useState('Admin');
  const [stats, setStats] = useState({ totalUsers: 0, totalTeachers: 0, totalStudents: 0, totalExams: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name || 'Admin');
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/stats');
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalTeachers: data.totalTeachers || 0,
          totalStudents: data.totalStudents || 0,
          totalExams: data.totalExams || 0,
        });
      } catch (err) {
        console.error('Lỗi khi tải thống kê admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-bg">
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Hệ thống quản trị</h1>
          <p>Xin chào, {username}</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>Tổng người dùng</h3>
            <p className="admin-stat-number">{loading ? '...' : stats.totalUsers}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Giáo viên</h3>
            <p className="admin-stat-number text-purple">{loading ? '...' : stats.totalTeachers}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Học sinh</h3>
            <p className="admin-stat-number text-blue">{loading ? '...' : stats.totalStudents}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Bài thi đã tạo</h3>
            <p className="admin-stat-number">{loading ? '...' : stats.totalExams}</p>
          </div>
        </div>

        {/* Feature cards container */}
        <AdminFeatures />
      </div>
    </div>
  );
}

export default AdminDashboard;