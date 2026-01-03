import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';
import './TeacherExamHistory.css';

function TeacherExamHistory() {
  const location = useLocation();
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(location.state?.selectedExamId || '');
  const [results, setResults] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    fetchTeacherExams();
  }, []);

  // If page was navigated here with a selectedExamId in location.state, ensure it's used after exams list loads
  useEffect(() => {
    if (location.state?.selectedExamId && exams.find(e => e._id === location.state.selectedExamId)) {
      setSelectedExamId(location.state.selectedExamId);
    }
  }, [location.state, exams]);
  const fetchTeacherExams = async () => {
    setLoadingExams(true);
    try {
      const res = await fetch('http://localhost:5001/api/exams');
      const data = await res.json();
      const stored = localStorage.getItem('currentUser');
      const user = stored ? JSON.parse(stored) : null;
      if (user) {
        // Filter exams created by this teacher
        const myExams = data.filter(e => {
          // e.creator can be string id or object
          const creatorId = e.creator && typeof e.creator === 'object' ? e.creator._id : e.creator;
          return creatorId === (user.id || user._id);
        });
        setExams(myExams);
      } else {
        setExams([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bài thi của giáo viên', err);
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) fetchResults(selectedExamId);
    else setResults([]);
  }, [selectedExamId]);

  const fetchResults = async (examId) => {
    setLoadingResults(true);
    try {
      const res = await fetch(`http://localhost:5001/api/results/exam/${examId}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Lỗi khi lấy kết quả', err);
      setResults([]);
    } finally {
      setLoadingResults(false);
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
    a.download = `teacher_results_${selectedExamId || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <TeacherNavbar />
      <div className="teacher-results-container">
        <h2>Lịch sử bài thi</h2>

        {loadingExams ? (
          <p>Đang tải danh sách bài thi...</p>
        ) : (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="form-control" style={{ maxWidth: 420 }}>
              <option value="">-- Chọn bài thi --</option>
              {exams.map(ex => (
                <option key={ex._id} value={ex._id}>{ex.title} ({new Date(ex.startTime).toLocaleDateString('vi-VN')})</option>
              ))}
            </select>
            <button className="btn-export" onClick={exportCSV} disabled={!results.length}>Export CSV</button>
          </div>
        )}

        {loadingResults ? <p>Đang tải kết quả...</p> : (
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
              {results.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>Không có kết quả.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TeacherExamHistory;
