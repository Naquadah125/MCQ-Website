import React, { useState, useEffect } from 'react';
import TeacherNavbar from '../../components/TeacherNavbar';
import './TeacherOverview.css';

function TeacherOverview() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name || 'Giáo viên');
    }
  }, []);

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="overview-container">
        <div className="overview-header">
          <h1>Xin chào, {username}! 👨‍🏫</h1>
          <p>Quản lý lớp học và bài thi của bạn</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng số bài thi</h3>
            <p className="stat-number">12</p>
          </div>
          <div className="stat-card">
            <h3>Lớp học đang hoạt động</h3>
            <p className="stat-number">3</p>
          </div>
          <div className="stat-card">
            <h3>Học sinh tham gia</h3>
            <p className="stat-number">145</p>
          </div>
          <div className="stat-card">
            <h3>Bài cần chấm</h3>
            <p className="stat-number text-orange">5</p>
          </div>
        </div>

        <div className="recent-section">
          <h2>Bài thi gần đây</h2>
          <div className="exam-table-wrapper">
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Tên bài thi</th>
                  <th>Mã thi</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kiểm tra 15 phút Toán</td>
                  <td><span className="code-badge">A1B2</span></td>
                  <td><span className="status-badge active">Đang diễn ra</span></td>
                  <td>20/10/2023</td>
                  <td><button className="btn-action">Chi tiết</button></td>
                </tr>
                <tr>
                  <td>Thi giữa kỳ Văn học</td>
                  <td><span className="code-badge">C3D4</span></td>
                  <td><span className="status-badge ended">Đã kết thúc</span></td>
                  <td>15/10/2023</td>
                  <td><button className="btn-action">Xem điểm</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherOverview;