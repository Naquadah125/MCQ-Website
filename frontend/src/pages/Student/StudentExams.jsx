import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/StudentNavbar';
import './StudentExams.css';

function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('All');

  useEffect(() => {
    // Lấy ID học sinh từ localStorage
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user) {
      // GỌI API MỚI: Truyền studentId để biết bài nào đã làm
      fetch(`http://localhost:5001/api/exams/student/${user.id || user._id}`)
        .then(async res => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
          }
          return res.json();
        })
        .then(data => {
          setExams(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Fetch student exams error:', err);
          setLoading(false);
        });
    }
  }, []);

  const getSortedExams = () => {
    const now = new Date();
    let filtered = exams;
    if (filterSubject !== 'All') {
      filtered = exams.filter(ex => 
        ex.title.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    const ongoing = [];
    const upcoming = [];
    const finished = [];

    filtered.forEach(ex => {
      // ƯU TIÊN: Nếu đã làm rồi, cho xuống nhóm "đã kết thúc/hoàn thành"
      if (ex.isCompleted) {
        finished.push({ ...ex, status: 'completed' });
        return;
      }

      const start = new Date(ex.startTime);
      const end = new Date(ex.endTime);

      if (now >= start && now <= end) ongoing.push({ ...ex, status: 'ongoing' });
      else if (now < start) upcoming.push({ ...ex, status: 'upcoming' });
      else finished.push({ ...ex, status: 'finished' });
    });

    return [...ongoing, ...upcoming, ...finished];
  };

  const sortedExams = getSortedExams();

  if (loading) return (
    <div className="student-exams-page">
      <StudentNavbar />
      <div className="loading-container">Đang tải...</div>
    </div>
  );

  return (
    <div className="student-exams-page">
      <StudentNavbar />
      <div className="exams-container">
        <div className="exams-header">
          <h2>Danh sách kỳ thi</h2>
          <div className="filter-section">
            <select 
              value={filterSubject} 
              onChange={(e) => setFilterSubject(e.target.value)}
              className="subject-filter"
            >
              <option value="All">Tất cả môn học</option>
              <option value="Toán">Toán học</option>
              <option value="Vật Lý">Vật Lý</option>
              <option value="Hóa Học">Hóa Học</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="exams-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên kỳ thi</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedExams.map((ex, index) => {
                const isOngoing = ex.status === 'ongoing';
                const isCompleted = ex.status === 'completed';
                const isFinished = ex.status === 'finished';

                return (
                  <tr key={ex._id} className={`exam-row ${isCompleted ? 'row-completed' : ''}`}>
                    <td>{index + 1}</td>
                    <td className="exam-title">{ex.title}</td>
                    <td>{new Date(ex.startTime).toLocaleString('vi-VN')}</td>
                    <td>{new Date(ex.endTime).toLocaleString('vi-VN')}</td>
                    <td>{ex.questions?.length * 2 || 0} phút</td>
                    <td>
                      <span className={`status-badge ${ex.status}`}>
                        {isCompleted ? '✓ Đã hoàn thành' : isOngoing ? '● Đang diễn ra' : isFinished ? 'Đã kết thúc' : 'Sắp diễn ra'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="action-wrapper">
                        {isCompleted ? (
                          <button 
                            className="btn-join btn-view-result"
                            onClick={() => navigate('/student/history')}
                          >
                            Xem lại
                          </button>
                        ) : (
                          <button 
                            className={`btn-join ${!isOngoing ? 'disabled' : ''}`}
                            disabled={!isOngoing}
                            onClick={() => navigate(`/student/exam-detail/${ex._id}`)}
                          >
                            Tham gia
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sortedExams.length === 0 && (
            <div className="no-data">Không có kỳ thi nào phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentExams;