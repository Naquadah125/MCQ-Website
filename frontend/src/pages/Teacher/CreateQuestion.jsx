import React, { useState } from 'react';
import TeacherNavbar from '../../components/TeacherNavbar';
import './CreateQuestion.css';

function CreateQuestion() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Lấy thông tin user hiện tại để gán author
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setMessage({ text: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!', type: 'error' });
      return;
    }

    // Chuẩn bị dữ liệu đúng format Backend yêu cầu
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
      explanation: formData.explanation,
      author: user.id 
    };

    try {
      const response = await fetch('http://localhost:5001/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage({ text: 'Thêm câu hỏi thành công!', type: 'success' });
        // Reset form (giữ lại môn và lớp để nhập tiếp)
        setFormData({
          ...formData,
          content: '',
          optionA: '', optionB: '', optionC: '', optionD: '',
          explanation: ''
        });
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.message || 'Lỗi khi lưu câu hỏi.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Không thể kết nối đến Server.', type: 'error' });
    }
  };

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="create-question-container">
        <div className="question-form-card">
          <div className="form-header">
            <h2>Tạo Câu Hỏi Mới</h2>
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
              <textarea 
                id="content" 
                rows="3" 
                placeholder="Ví dụ: Công thức tính diện tích hình tròn là gì?" 
                required
                value={formData.content}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="options-grid">
              <div className="form-group">
                <label>Đáp án A</label>
                <input type="text" id="optionA" required value={formData.optionA} onChange={handleChange} placeholder="Nhập đáp án A..." />
              </div>
              <div className="form-group">
                <label>Đáp án B</label>
                <input type="text" id="optionB" required value={formData.optionB} onChange={handleChange} placeholder="Nhập đáp án B..." />
              </div>
              <div className="form-group">
                <label>Đáp án C</label>
                <input type="text" id="optionC" required value={formData.optionC} onChange={handleChange} placeholder="Nhập đáp án C..." />
              </div>
              <div className="form-group">
                <label>Đáp án D</label>
                <input type="text" id="optionD" required value={formData.optionD} onChange={handleChange} placeholder="Nhập đáp án D..." />
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
              <textarea 
                id="explanation" 
                rows="2" 
                placeholder="Giải thích tại sao đáp án đó đúng (hiện khi học sinh làm sai)..."
                value={formData.explanation}
                onChange={handleChange}
              ></textarea>
            </div>

            {message.text && (
              <div className={`msg-box ${message.type}`}>{message.text}</div>
            )}

            <button type="submit" className="btn-save-question">Lưu câu hỏi vào ngân hàng</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateQuestion;