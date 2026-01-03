import React, { useState, useEffect } from 'react';
import TeacherNavbar from '../../components/TeacherNavbar';
import './TeacherOverview.css';

function TeacherOverview() {
  const [username, setUsername] = useState('Giáo viên');
  const [stats, setStats] = useState({
    totalExams: 0,
    totalQuestions: 0,
    totalStudents: 0,
    totalResults: 0
  });
  const [recentExams, setRecentExams] = useState([]);

  useEffect(() => {
    // 1. Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name || 'Giáo viên');
    }

    // 2. Lấy số liệu thống kê
    fetch('http://localhost:5001/api/teacher/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Lỗi fetch stats:", err));

    // 3. Lấy danh sách bài thi gần đây
    fetch('http://localhost:5001/api/teacher/recent-exams')
      .then(res => res.json())
      .then(data => setRecentExams(data))
      .catch(err => console.error("Lỗi fetch exams:", err));
  }, []);

  const getStatusLabel = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) return { label: 'Đang diễn ra', class: 'active' };
    if (now < start) return { label: 'Sắp diễn ra', class: 'upcoming' };
    return { label: 'Đã kết thúc', class: 'ended' };
  };

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="overview-container">
        <div className="overview-header">
          <h1>Xin chào, {username}!</h1>
          <p>Quản lý lớp học và bài thi của bạn</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng số bài thi</h3>
            <p className="stat-number">{stats.totalExams}</p>
          </div>
          <div className="stat-card">
            <h3>Ngân hàng câu hỏi</h3>
            <p className="stat-number">{stats.totalQuestions}</p>
          </div>
          <div className="stat-card">
            <h3>Học sinh tham gia</h3>
            <p className="stat-number">{stats.totalStudents}</p>
          </div>
          <div className="stat-card">
            <h3>Lượt thi hoàn thành</h3>
            <p className="stat-number text-orange">{stats.totalResults}</p>
          </div>
        </div>

        <div className="recent-section">
          <h2>Bài thi gần đây</h2>
          <div className="exam-table-wrapper">
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Tên bài thi</th>
                  <th>Mã thi (ID)</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.length > 0 ? (
                  recentExams.map((exam) => {
                    const status = getStatusLabel(exam.startTime, exam.endTime);
                    return (
                      <tr key={exam._id}>
                        <td>{exam.title}</td>
                        <td><span className="code-badge">{exam._id.slice(-6).toUpperCase()}</span></td>
                        <td><span className={`status-badge ${status.class}`}>{status.label}</span></td>
                        <td>{new Date(exam.createdAt || Date.now()).toLocaleDateString('vi-VN')}</td>
                        <td><button className="btn-action">Chi tiết</button></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Chưa có bài thi nào được tạo.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherOverview;