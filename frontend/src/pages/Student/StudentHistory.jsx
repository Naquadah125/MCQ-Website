import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import './StudentHistory.css';

function StudentHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      fetch(`http://localhost:5001/api/results/student/${user.id || user._id}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="history-page">
      <StudentNavbar />
      <div className="history-container">
        <div className="history-header">
          <h2>Lịch sử kết quả thi 📊</h2>
        </div>

        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên kỳ thi</th>
                <th>Thời điểm nộp</th>
                <th>Thời gian</th>
                <th>Số câu đúng</th>
                <th>Tỉ lệ</th>
                <th>Kết quả</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => {
                const ratio = Math.round((res.correctCount / res.totalQuestions) * 100);
                const isPassed = ratio >= 50;

                return (
                  <tr key={res._id} className="history-row">
                    <td>{index + 1}</td>
                    <td className="exam-title">{res.exam?.title || 'N/A'}</td>
                    <td>{new Date(res.completedAt).toLocaleString('vi-VN')}</td>
                    <td>{res.totalQuestions * 2} phút</td>
                    {/* Cập nhật hiển thị điểm theo dạng X/Y */}
                    <td className="score-cell">
                      {res.correctCount}/{res.totalQuestions}
                    </td>
                    <td>{ratio}%</td>
                    <td>
                      <span className={`result-badge ${isPassed ? 'pass' : 'fail'}`}>
                        {isPassed ? 'Đạt' : 'Không đạt'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn-detail-view" onClick={() => alert('Chức năng xem chi tiết đang phát triển')}>
                        Xem lại
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {results.length === 0 && !loading && (
            <div className="no-data">Bạn chưa hoàn thành bài thi nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHistory;