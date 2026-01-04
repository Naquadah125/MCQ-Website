import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';

function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setName(parsed.name || '');
      setFullName((parsed.profile && parsed.profile.fullName) || '');
      setPhone((parsed.profile && parsed.profile.phoneNumber) || '');
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name,
      profile: {
        ...(user.profile || {}),
        fullName,
        phoneNumber: phone
      }
    };

    // For now update localStorage (client-side) so UI reflects change instantly.
    localStorage.setItem('currentUser', JSON.stringify(updated));
    setUser(updated);
    alert('Thông tin đã được lưu (chỉ trên client).');
    // Optionally navigate back
    navigate(-1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
        <h2>Chỉnh sửa thông tin cá nhân</h2>
        <form onSubmit={handleSave} style={{ marginTop: 16, background: '#fff', padding: 20, borderRadius: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Tên hiển thị</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Họ và tên</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Số điện thoại</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-create">Lưu</button>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'white' }}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
