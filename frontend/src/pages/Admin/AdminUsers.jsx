import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://localhost:5001/api/admin/users', { headers });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này không? Hành động này không thể hoàn tác.')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:5001/api/admin/users/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Xóa thất bại');
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert('Không thể xóa người dùng');
    }
  };

  const handleResetPassword = async (id, userName) => {
    const newPassword = window.prompt(`Nhập mật khẩu mới cho "${userName}" (để trống để hủy):`);
    if (!newPassword) return;
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:5001/api/admin/users/${id}/reset-password`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ password: newPassword })
      });
      if (!res.ok) throw new Error('Đặt lại mật khẩu thất bại');

      alert('Đặt lại mật khẩu thành công!');
    } catch (err) {
      console.error(err);
      alert('Không thể đặt lại mật khẩu');
    }
  };

  const getRoleBadge = (role) => {
    return <span className={`role-badge ${role}`}>{role === 'student' ? 'Học sinh' : role === 'teacher' ? 'Giáo viên' : role}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="admin-bg">
      <AdminNavbar />
      
      <div className="admin-container">
        <div className="table-card">
          <h2>Danh sách người dùng</h2>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Đang tải dữ liệu...</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>STT</th>
                  <th style={{ width: '20%' }}>Họ và tên</th>
                  <th style={{ width: '15%' }}>Email</th>
                  <th style={{ width: '15%' }}>Ngày tạo</th>
                  <th style={{ width: '10%' }}>Vai trò</th>
                  <th style={{ width: '15%' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-reset" 
                          onClick={() => handleResetPassword(u._id, u.name)}
                          title="Đặt lại mật khẩu mới"
                        >
                          Đổi MK
                        </button>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => handleDelete(u._id)}
                          title="Xóa người dùng"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Chưa có người dùng nào được tạo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;