import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/StudentNavbar';
import './ExamInstruction.css';

function ExamInstruction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/api/exams`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(ex => ex._id === id);
        setExam(found);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="instruction-page">
      <StudentNavbar />
      <div className="loading-state">Đang tải thông tin...</div>
    </div>
  );

  if (!exam) return (
    <div className="instruction-page">
      <StudentNavbar />
      <div className="error-state">Không tìm thấy bài thi!</div>
    </div>
  );

  return (
    <div className="instruction-page">
      <StudentNavbar />
      <div className="instruction-container">
        <div className="instruction-card">
          <div className="ins-header">
            <span className="ins-badge">Thông tin bài thi</span>
            <h1>{exam.title}</h1>
            <p className="ins-desc">{exam.description || "Không có mô tả cho bài thi này."}</p>
          </div>

          <div className="ins-content">
            <div className="ins-grid">
              <div className="ins-item">
                <span className="label">Số câu hỏi</span>
                <span className="value">{exam.questions.length} câu</span>
              </div>
              <div className="ins-item">
                <span className="label">Thời gian làm bài</span>
                <span className="value">{exam.questions.length * 2} phút</span>
              </div>
              <div className="ins-item">
                <span className="label">Hình thức</span>
                <span className="value">Trắc nghiệm</span>
              </div>
            </div>

            <div className="rules-section">
              <h3>⚠️ Quy định phòng thi:</h3>
              <ul>
                <li>Đảm bảo kết nối mạng ổn định trong suốt quá trình làm bài.</li>
                <li>Không thoát trình duyệt hoặc tải lại trang khi chưa nộp bài.</li>
                <li>Bài làm sẽ tự động nộp khi hết thời gian quy định.</li>
                <li>Mỗi câu hỏi chỉ có duy nhất một đáp án đúng.</li>
              </ul>
            </div>
          </div>

          <div className="ins-footer">
            <button className="btn-back" onClick={() => navigate('/student/join')}>
              Quay lại
            </button>
            <button className="btn-start" onClick={() => navigate(`/student/take-exam/${id}`)}>
              Bắt đầu làm bài ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamInstruction;