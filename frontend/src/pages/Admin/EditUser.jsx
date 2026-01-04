import React, { useState } from 'react';
import './CreateUser.css';

const EditUser = ({ user, onSave, onCancel }) => {
  const [role, setRole] = useState(user.role || 'student');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhoneNumber] = useState((user.profile && user.profile.phoneNumber) || '');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      role,
      profile: {
        phoneNumber
      }
    };
    if (password) {
      payload.password = password;
    };
    onSave(user._id, payload);
  };

  return (
    <div className="create-user-container">
      <div className="form-card">
        <h2>Chỉnh sửa tài khoản</h2>
        <p>Cập nhật thông tin bên dưới cho Giáo viên hoặc Học sinh.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Loại tài khoản</label>
            <select id="role" className="form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Học sinh</option>
              <option value="teacher">Giáo viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input id="name" required placeholder="Ví dụ: Nguyễn Văn A" type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email đăng nhập</label>
            <input id="email" required placeholder="user@school.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
              <label htmlFor="password">Mật khẩu mới</label>
              <input id="password" placeholder="Nhập mật khẩu mới nếu muốn đổi" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại</label>
            <input id="phoneNumber" placeholder="Số điện thoại" type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="submit" className="btn-create" style={{ flex: 1 }}>Lưu thay đổi</button>
            <button type="button" className="btn-create" style={{ flex: 1, backgroundColor: '#eee', color: '#333' }} onClick={onCancel}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
