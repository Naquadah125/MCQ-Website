import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import './AdminQuestionBank.css';

function AdminQuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bản đồ dịch độ khó sang tiếng Việt
  const difficultyMap = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó'
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/questions');
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch questions error', err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Xóa thất bại');
      setQuestions(qs => qs.filter(q => q._id !== id));
    } catch (err) {
      console.error(err);
      alert('Không thể xóa câu hỏi');
    }
  };

  return (
    <div className="admin-bg">
      <AdminNavbar />
      <div className="admin-container">
        <div className="table-card">
          <div className="table-card-header">
            <h2>Danh sách câu hỏi</h2>
            <div>
              <button className="btn-create" onClick={() => window.location.href = '/admin/create-question'}>Thêm câu hỏi</button>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Đang tải ...</p>
          ) : (
            <table className="questions-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>STT</th>
                  <th style={{ width: '25%' }}>Môn</th>
                  <th style={{ width: '15%' }}>Khối</th>
                  <th style={{ width: '15%' }}>Độ khó</th>
                  <th style={{ width: '20%' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={q._id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{q.subject}</td>
                    <td>{q.grade}</td>
                    <td>{difficultyMap[q.difficulty] || q.difficulty}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action" onClick={() => window.location.href = `/admin/create-question?id=${q._id}`}>Sửa</button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(q._id)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Chưa có câu hỏi nào.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminQuestionBank;
