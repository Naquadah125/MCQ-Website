import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { useParams } from 'react-router-dom';
import './AdminExamResults.css';

function AdminExamResults() {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/results/exam/${id}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Student', 'Score', 'Total Questions', 'Correct Count', 'Submitted At'];
    const rows = results.map(r => [r.student.name || r.student.email, r.score, r.totalQuestions, r.correctCount, r.completedAt || '']);
    let csvContent = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results_${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-results-container">
        <h2>Kết quả bài thi</h2>
        <button onClick={exportCSV} className="btn-export">Export CSV</button>

        {loading ? <p>Đang tải...</p> : (
          <table className="results-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Học sinh</th>
                <th>Điểm</th>
                <th>Số câu đúng</th>
                <th>Tổng câu</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={r._id}>
                  <td>{idx + 1}</td>
                  <td>{r.student?.name || r.student?.email}</td>
                  <td>{r.score}</td>
                  <td>{r.correctCount}</td>
                  <td>{r.totalQuestions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminExamResults;