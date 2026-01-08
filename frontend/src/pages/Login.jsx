import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_ENDPOINT = 'http://localhost:5001/api/auth/login';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        if (role === 'teacher') {
          navigate('/teacher');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
      }
    } catch (err) {
      setError('Không thể kết nối đến Server (Port 5001). Hãy kiểm tra lại backend!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h1>Chào mừng trở lại</h1>
          <p>Vui lòng đăng nhập để tiếp tục</p>
        </div>

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
          <button 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
            type="button"
          >
            Admin
          </button>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="email@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div style={{color: 'red', marginBottom: '10px', fontSize: '14px'}}>{error}</div>}

          <button type="submit" className="btn-submit">
            Đăng nhập
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