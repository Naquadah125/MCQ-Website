import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import './AdminExams.css';

function AdminExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ title: '', subject: '', grade: '', status: '' });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(k => { if (filters[k]) params.append(k, filters[k]); });
      const res = await fetch(`http://localhost:5001/api/exams?${params.toString()}`);
      const data = await res.json();
      setExams(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài thi', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài thi này không?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`http://localhost:5001/api/admin/exams/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Xóa thất bại');
      setExams(exams.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      alert('Không thể xóa bài thi');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-exams-container">
        <div className="exams-header">
          <h2>Danh sách bài thi</h2>
        </div>

        <div className="exams-filters">
          <input placeholder="Tìm theo tiêu đề" value={filters.title} onChange={e => setFilters({ ...filters, title: e.target.value })} />
          <input placeholder="Môn" value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value })} />
          <input placeholder="Khối" value={filters.grade} onChange={e => setFilters({ ...filters, grade: e.target.value })} />
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Tất cả</option>
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>
          <button onClick={fetchExams}>Lọc</button>
        </div>

        {loading ? <p>Đang tải...</p> : (
          <table className="exams-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên bài thi</th>
                <th>Môn/Khối</th>
                <th>Thời gian (phút)</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((ex, idx) => (
                <tr key={ex._id}>
                  <td>{idx + 1}</td>
                  <td>{ex.title}</td>
                  <td>{ex.subject || '-'} / {ex.grade || '-'}</td>
                  <td>{ex.durationMinutes || '—'}</td>
                  <td>{ex.status}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/exams/${ex._id}/results`)}>Kết quả</button>
                    <button className="btn-delete" onClick={() => handleDelete(ex._id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminExams;