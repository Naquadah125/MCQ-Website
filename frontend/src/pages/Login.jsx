import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // Mặc định là học sinh

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h1>Chào mừng trở lại</h1>
          <p>Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {/* Role Selector */}
        <div className="role-selector">
          <button 
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
            type="button"
          >
            Học sinh
          </button>
          <button 
            className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
            onClick={() => setRole('teacher')}
            type="button"
          >
            Giáo viên
          </button>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="email@example.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn-submit">
            Đăng nhập ({role === 'student' ? 'Học sinh' : 'Giáo viên'})
          </button>
        </form>

        <div className="login-footer">
          <p>Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;