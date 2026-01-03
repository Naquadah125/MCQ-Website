import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminFeatures.css';

function AdminFeatures() {
  const navigate = useNavigate();

  return (
    <div className="admin-features">
      <h2 className="features-header">Chức năng chính</h2>
      <div className="features-grid">
        <div className="feature-card">
          <div className="card-body">
            <h3>Tạo User</h3>
            <p>Thêm tài khoản mới cho giáo viên hoặc học sinh.</p>
          </div>
          <div className="card-footer">
            <button className="btn-settings" onClick={() => navigate('/admin/create-user')}>SETTINGS</button>
          </div>
        </div>

        <div className="feature-card">
          <div className="card-body">
            <h3>Quản lý User</h3>
            <p>Quản lý, tìm kiếm và chỉnh sửa thông tin người dùng hiện có.</p>
          </div>
          <div className="card-footer">
            <button className="btn-settings" onClick={() => navigate('/admin/users')}>SETTINGS</button>
          </div>
        </div>

        <div className="feature-card">
          <div className="card-body">
            <h3>Quản lý thi</h3>
            <p>Quản lý bài thi.</p>
          </div>
          <div className="card-footer">
            <button className="btn-settings" onClick={() => navigate('/admin/exams')}>SETTINGS</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;
