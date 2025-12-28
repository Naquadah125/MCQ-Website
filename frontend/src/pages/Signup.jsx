import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-header">
          <h1>Tạo tài khoản</h1>
          <p>Bắt đầu hành trình học tập của bạn</p>
        </div>

        <form className="signup-form">
          <div className="form-group">
            <label htmlFor="fullname">Họ và tên</label>
            <input 
              type="text" 
              id="fullname" 
              placeholder="Nguyễn Văn A" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="nhapemail@example.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              id="confirm-password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="btn-submit">Đăng ký</button>
        </form>

        <div className="signup-footer">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;