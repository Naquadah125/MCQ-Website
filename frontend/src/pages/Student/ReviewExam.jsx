import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReviewExam.css';
import './TakeExam.css';

function ReviewExam() {
  const { id } = useParams(); // result id
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/results/${id}`);
        if (!res.ok) throw new Error('Không lấy được dữ liệu');
        const data = await res.json();
        setResult(data);
      } catch (e) {
        console.error('Failed to fetch result', e);
        setResult(null);
      }
      setLoading(false);
    };
    fetchResult();
  }, [id]);

  if (loading) return <div className="take-exam-loading">Đang tải lịch sử...</div>;
  if (!result) return <div className="take-exam-error">Không tìm thấy lịch sử này</div>;

  const exam = result.exam || { questions: [] };
  const answers = result.answers || [];
  const total = result.totalQuestions || exam.questions.length;

  return (
    <div className="take-exam-page">
      <div className="exam-sidebar">
        <div className="timer-box" style={{ background: '#111827' }}>
          <div style={{ fontSize: 14, opacity: 0.85 }}>Kết quả</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{result.score} / 10</div>
          <div style={{ marginTop: 8 }}>{result.correctCount}/{total} câu đúng</div>
          <div style={{ marginTop: 8, fontSize: 13 }}>{new Date(result.completedAt).toLocaleString('vi-VN')}</div>
        </div>

        <div className="question-nav">
          <div className="nav-grid">
            {exam.questions.map((_, idx) => {
              const ans = answers[idx] || {};
              const isCorrect = ans.isCorrect;
              return (
                <div key={idx} onClick={() => setSelectedIndex(idx)} className={`nav-item ${isCorrect ? 'answered' : ''} ${selectedIndex === idx ? 'selected' : ''}`}>
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="exam-main">
        <div className="exam-title-bar">
          <h2 style={{ margin: 0 }}>{exam.title || 'Đề thi'}</h2>
          <div style={{ marginTop: 8, color: '#666' }}>{exam.description || ''}</div>
        </div>

        <div className="questions-container">
          {exam.questions.map((q, qIdx) => {
            const ans = answers[qIdx] || { selectedOption: -1, correctOption: q.correctOption };
            return (
              <div key={qIdx} className="question-card">
                <p className="question-text"><strong>Câu {qIdx + 1}:</strong> {q.questionText}</p>
                <div className="options-list">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = ans.selectedOption === oIdx;
                    const isCorrect = (q.correctOption === oIdx) || (ans.correctOption === oIdx);
                    const className = `option-item ${isCorrect ? 'correct' : ''} ${isSelected && !isCorrect ? 'wrong' : ''} ${isSelected ? 'selected' : ''}`;
                    return (
                      <div key={oIdx} className={className}>
                        <div style={{ fontWeight: 700, marginRight: 12 }}>{String.fromCharCode(65 + oIdx)}.</div>
                        <div style={{ flex: 1 }}>{opt}</div>
                        {isSelected && <div style={{ marginLeft: 12, fontWeight: 700 }}>{isCorrect ? 'Đúng' : 'Đáp án của bạn'}</div>}
                        {isCorrect && <div style={{ marginLeft: 12, color: '#065f46', fontWeight: 700 }}>Đáp án đúng</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReviewExam;
