import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';
import './TeacherOrganizeSelection.css';

function TeacherOrganizeSelection() {
  const navigate = useNavigate();

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="selection-container">
        <div className="selection-header">
          <h1>Tổ chức thi</h1>
          <p>Chọn phương thức bạn muốn sử dụng để tạo đề thi mới.</p>
        </div>

        <div className="selection-grid">
          <div className="selection-card" onClick={() => navigate('/teacher/organize/bank')}>
            <div className="card-icon"></div>
            <h3>Từ Ngân Hàng Câu Hỏi</h3>
            <p>Chọn các câu hỏi có sẵn trong kho dữ liệu của bạn để tạo thành một đề thi nhanh chóng.</p>
            <button className="btn-select">Chọn ngay</button>
          </div>

          <div className="selection-card" onClick={() => navigate('/teacher/import')}>
            <div className="card-icon"></div>
            <h3>Tự Import</h3>
            <p>Tải lên file câu hỏi hoặc nhập thủ công từng câu ngay tại đây.</p>
            <button className="btn-select">Bắt đầu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherOrganizeSelection;