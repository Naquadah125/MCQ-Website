import React, { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import './CreateUser.css';

function CreateUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          text: `Đã tạo tài khoản ${formData.role === 'teacher' ? 'Giáo viên' : 'Học sinh'} thành công!`, 
          type: 'success' 
        });
        setFormData({ name: '', email: '', password: '', role: 'student' });
      } else {
        setMessage({ text: data.message || 'Tạo thất bại', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Lỗi kết nối server', type: 'error' });
    }
  };

  return (
    <div className="admin-bg">
      <AdminNavbar />
      <div className="create-user-container">
        <div className="form-card">
          <h2>Tạo tài khoản mới</h2>
          <p>Nhập thông tin bên dưới để tạo tài khoản cho Giáo viên hoặc Học sinh.</p>
          
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="role">Loại tài khoản</label>
              <select 
                id="role" 
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Họ và tên</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email đăng nhập</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="user@school.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input 
                type="text" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu..."
              />
            </div>

            {message.text && (
              <div className={`message-box ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btn-create">Tạo tài khoản</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;