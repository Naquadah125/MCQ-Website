import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';
import './TeacherCreateSelection.css';

function TeacherCreateSelection() {
  const navigate = useNavigate();

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="selection-container">
        <div className="selection-header">
          <h1>Bạn muốn tạo gì hôm nay? ✍️</h1>
          <p>Chọn một tùy chọn bên dưới để bắt đầu xây dựng nội dung.</p>
        </div>

        <div className="selection-grid">
          {/* Nút 1: Tạo câu hỏi */}
          <div className="selection-card" onClick={() => navigate('/teacher/create-question')}>
            <div className="card-icon">❓</div>
            <h3>Tạo Câu Hỏi Mới</h3>
            <p>Thêm câu hỏi trắc nghiệm vào ngân hàng đề thi. Hỗ trợ nhập 4 đáp án và lời giải thích.</p>
            <button className="btn-select">Bắt đầu tạo</button>
          </div>

          {/* Nút 2: Tạo bài thi */}
          <div className="selection-card" onClick={() => navigate('/teacher/create-exam')}>
            <div className="card-icon">📝</div>
            <h3>Tạo Bài Thi Mới</h3>
            <p>Tạo một bài thi hoàn chỉnh, thiết lập thời gian và chọn các câu hỏi từ ngân hàng.</p>
            <button className="btn-select secondary">Sắp ra mắt</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherCreateSelection;