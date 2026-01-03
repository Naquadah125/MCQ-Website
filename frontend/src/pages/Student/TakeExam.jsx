import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TakeExam.css';

function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/api/exams`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(ex => ex._id === id);
        if (found) {
          setExam(found);
          
          // Logic mới: Lấy trực tiếp durationMinutes (phút) đổi ra giây
          const seconds = (found.durationMinutes || 0) * 60;
          setTimeLeft(seconds);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // Nếu hết giờ (timeLeft === 0) và đã load xong data thì nộp bài
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !loading && exam) {
      handleFinish();
    }
    // eslint-disable-next-line
  }, [timeLeft, loading, exam]);

  const handleFinish = async () => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      alert("Hết phiên làm việc, vui lòng đăng nhập lại");
      return;
    }
    const user = JSON.parse(storedUser);

    const payload = {
      examId: id,
      studentId: user.id || user._id,
      studentAnswers: answers
    };

    try {
      const res = await fetch('http://localhost:5001/api/results/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Nộp bài thành công! Điểm của bạn: ${data.score}`);
        navigate('/student/join');
      } else {
        alert(data.message || "Lỗi khi nộp bài");
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ");
    }
  };

  if (loading) return <div className="take-exam-loading">Đang tải đề thi...</div>;
  if (!exam) return <div className="take-exam-error">Không tìm thấy đề thi</div>;

  return (
    <div className="take-exam-page">
      <div className="exam-sidebar">
        <div className="timer-box">
          <span>Thời gian còn lại</span>
          <div className={`time-display ${timeLeft < 60 ? 'warning' : ''}`}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
          <div className="time-info">
             {/* Hiển thị tổng thời gian dựa trên durationMinutes */}
            {exam.durationMinutes || 0} phút
          </div>
        </div>
        <div className="question-nav">
          <div className="nav-grid">
            {exam.questions.map((_, idx) => (
              <div key={idx} className={`nav-item ${answers[idx] !== undefined ? 'answered' : ''}`}>
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
        <button className="btn-submit-exam" onClick={handleFinish}>Nộp bài</button>
      </div>

      <div className="exam-main">
        <h2>{exam.title}</h2>
        <div className="questions-container">
          {exam.questions.map((q, qIdx) => (
            <div key={qIdx} className="question-card">
              <p><strong>Câu {qIdx + 1}:</strong> {q.questionText}</p>
              <div className="options-list">
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} className={`option-item ${answers[qIdx] === oIdx ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`q-${qIdx}`} 
                      onChange={() => setAnswers({...answers, [qIdx]: oIdx})}
                    />
                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TakeExam;