import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import TeacherNavbar from '../components/TeacherNavbar';
import './ProfileEdit.css';

function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setRole(parsed.role || (parsed.user && parsed.user.role) || 'student');
      setName(parsed.name || '');
      setEmail(parsed.email || (parsed.user && parsed.user.email) || '');
    }

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch('/api/profile/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('No profile');
        const profile = await res.json();
        setPhone(profile.phoneNumber || '');
        if (profile.user) {
          setRole(profile.user.role || role);
          setName(profile.user.name || name);
          setEmail(profile.user.email || email);
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Bạn cần đăng nhập để lưu.');

    // If a new password was entered, validate confirmation first
    if (password && password.trim() !== '') {
      if (confirmPassword !== password) {
        setPasswordError('Mật khẩu không khớp');
        return;
      }
    }

    const payload = {
      name,
      phoneNumber: phone
    };

    // Include new password only if the user entered one
    if (password && password.trim() !== '') {
      payload.password = password;
    }

    try {
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi khi lưu');

      // Update localStorage.currentUser so UI reflects new name/profile
      const stored = localStorage.getItem('currentUser');
      const parsed = stored ? JSON.parse(stored) : {};
      const updatedUser = { ...parsed, name, profile: data.profile };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Clear password and confirmation on success
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');

      alert('Cập nhật hồ sơ thành công');
      navigate(-1);
    } catch (err) {
      console.error('Save profile failed', err);
      alert('Lưu không thành công');
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải ...</div>;

  return (
    <div className="admin-bg">
      {role === 'teacher' ? <TeacherNavbar /> : <StudentNavbar />}

      <div className="admin-container">
        <div className="create-user-container">
          <div className="form-card">
            <h2>Chỉnh sửa tài khoản</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input id="name" required placeholder="Ví dụ: Nguyễn Văn A" type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email đăng nhập</label>
                <input id="email" required placeholder="user@school.com" type="email" value={email} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu mới</label>
                <input id="password" placeholder="Nhập mật khẩu mới nếu muốn đổi" autoComplete="new-password" type="password" value={password} onChange={e => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }} />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Nhập mật khẩu lại</label>
                <input id="confirmPassword" placeholder="Nhập lại mật khẩu" autoComplete="new-password" type="password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); if (passwordError) setPasswordError(''); }} />
                {passwordError && <p className="form-error">{passwordError}</p>}
              </div>


              <div className="form-group">
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <input id="phoneNumber" placeholder="Số điện thoại" type="text" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="submit" className="btn-create" style={{ flex: '1 1 0%' }}>Lưu thay đổi</button>
                <button type="button" className="btn-create" style={{ flex: '1 1 0%', backgroundColor: '#eeeeee', color: '#333' }} onClick={() => navigate(-1)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
