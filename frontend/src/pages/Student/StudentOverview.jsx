import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import './StudentOverview.css';

function StudentOverview() {
  const [username, setUsername] = useState('Học sinh');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name || 'Học sinh');
    }
  }, []);

  return (
    <div className="student-bg">
      <StudentNavbar />
      <div className="overview-container">
        <div className="overview-header">
          <h1>Chào mừng trở lại, {username}! 👋</h1>
          <p>Hôm nay bạn muốn ôn luyện gì?</p>
        </div>

        <div className="guide-section">
          <h2>Hướng dẫn sử dụng nhanh</h2>
          <div className="guide-grid">
            <div className="guide-card">
              <div className="guide-icon icon-blue">1</div>
              <h3>Tham gia bài thi</h3>
              <p>Nhập mã phòng thi từ giáo viên hoặc chọn bài thi công khai để bắt đầu làm bài.</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon icon-purple">2</div>
              <h3>Làm bài & Nộp</h3>
              <p>Trả lời các câu hỏi trắc nghiệm trong thời gian quy định và nộp bài để xem điểm số.</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon icon-green">3</div>
              <h3>Xem lịch sử</h3>
              <p>Xem lại các bài đã thi, phân tích lỗi sai và theo dõi sự tiến bộ của bản thân.</p>
            </div>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-box">
            <span className="stat-number">0</span>
            <span className="stat-label">Bài thi đã làm</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">0</span>
            <span className="stat-label">Điểm trung bình</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">0h</span>
            <span className="stat-label">Giờ ôn luyện</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentOverview;