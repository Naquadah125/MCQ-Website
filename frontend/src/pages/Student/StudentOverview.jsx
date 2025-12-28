import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import './StudentOverview.css';

function StudentOverview() {
  const [username, setUsername] = useState('Học sinh');
  const [stats, setStats] = useState({ count: 0, avg: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name || 'Học sinh');

      fetch(`http://localhost:5001/api/results/student/${user.id || user._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const totalScore = data.reduce((acc, curr) => acc + curr.score, 0);
            setStats({
              count: data.length,
              avg: data.length > 0 ? (totalScore / data.length).toFixed(1) : 0
            });
          }
        })
        .catch(err => console.error("Lỗi fetch stats:", err));
    }
  }, []);

  return (
    <div className="student-bg">
      <StudentNavbar />
      <div className="overview-container">
        <h1>Chào mừng, {username}!</h1>
        <div className="quick-stats">
          <div className="stat-box">
            <span className="stat-number">{stats.count}</span>
            <span className="stat-label">Bài thi đã làm</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{stats.avg}</span>
            <span className="stat-label">Điểm trung bình</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentOverview;