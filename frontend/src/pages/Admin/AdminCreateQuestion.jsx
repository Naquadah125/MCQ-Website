import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import '../Teacher/CreateQuestion.css';

function AdminCreateQuestion() {
  const query = new URLSearchParams(window.location.search);
  const editId = query.get('id');

  const [formData, setFormData] = useState({
    subject: 'Toán',
    grade: '12',
    difficulty: 'medium',
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (editId) {
      // load question
      fetch(`/api/questions`) // we'll filter locally
        .then(res => res.json())
        .then(data => {
          const q = data.find(x => x._id === editId);
          if (q) {
            setFormData({
              subject: q.subject,
              grade: q.grade,
              difficulty: q.difficulty,
              content: q.content,
              optionA: q.options?.[0]?.text || '',
              optionB: q.options?.[1]?.text || '',
              optionC: q.options?.[2]?.text || '',
              optionD: q.options?.[3]?.text || '',
              correctAnswer: q.correctAnswer || 'A',
              explanation: q.explanation || ''
            });
          }
        })
        .catch(err => console.error(err));
    }
  }, [editId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const payload = {
      subject: formData.subject,
      grade: formData.grade,
      difficulty: formData.difficulty,
      content: formData.content,
      options: [
        { key: 'A', text: formData.optionA },
        { key: 'B', text: formData.optionB },
        { key: 'C', text: formData.optionC },
        { key: 'D', text: formData.optionD }
      ],
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation
    };

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let res;
      if (editId) {
        res = await fetch(`/api/questions/${editId}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
      } else {
        res = await fetch('/api/questions', { method: 'POST', headers, body: JSON.stringify(payload) });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi');

      setMessage({ text: editId ? 'Cập nhật thành công' : 'Thêm câu hỏi thành công!', type: 'success' });
      if (!editId) {
        setFormData({ ...formData, content: '', optionA: '', optionB: '', optionC: '', optionD: '', explanation: '' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Lỗi khi lưu câu hỏi', type: 'error' });
    }
  };

  return (
    <div className="admin-bg">
      <AdminNavbar />
      <div className="create-question-container">
        <div className="question-form-card">
          <div className="form-header">
            <h2>{editId ? 'Sửa câu hỏi' : 'Tạo Câu Hỏi Mới'}</h2>
            <p>Nhập chi tiết câu hỏi và đáp án bên dưới</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Môn học</label>
                <select id="subject" value={formData.subject} onChange={handleChange}>
                  <option value="Toán">Toán</option>
                  <option value="Vật Lý">Vật Lý</option>
                  <option value="Hóa Học">Hóa Học</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Sinh Học">Sinh Học</option>
                </select>
              </div>
              <div className="form-group">
                <label>Khối lớp</label>
                <select id="grade" value={formData.grade} onChange={handleChange}>
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Độ khó</label>
                <select id="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Nội dung câu hỏi</label>
              <textarea id="content" rows="3" required value={formData.content} onChange={handleChange}></textarea>
            </div>

            <div className="options-grid">
              <div className="form-group">
                <label>Đáp án A</label>
                <input type="text" id="optionA" required value={formData.optionA} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Đáp án B</label>
                <input type="text" id="optionB" required value={formData.optionB} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Đáp án C</label>
                <input type="text" id="optionC" required value={formData.optionC} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Đáp án D</label>
                <input type="text" id="optionD" required value={formData.optionD} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label style={{color: '#ff6600', fontWeight: 'bold'}}>Đáp án đúng</label>
              <select id="correctAnswer" value={formData.correctAnswer} onChange={handleChange} style={{borderColor: '#ff6600'}}>
                <option value="A">Đáp án A</option>
                <option value="B">Đáp án B</option>
                <option value="C">Đáp án C</option>
                <option value="D">Đáp án D</option>
              </select>
            </div>

            <div className="form-group">
              <label>Giải thích (Hint)</label>
              <textarea id="explanation" rows="2" value={formData.explanation} onChange={handleChange}></textarea>
            </div>

            {message.text && (
              <div className={`msg-box ${message.type}`}>{message.text}</div>
            )}

            <button type="submit" className="btn-save-question">{editId ? 'Cập nhật' : 'Lưu câu hỏi vào ngân hàng'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateQuestion;
