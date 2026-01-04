import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';
import './CreateExamFromBank.css';

function CreateExamFromBank() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterGrade, setFilterGrade] = useState('All');
  const [importedSource, setImportedSource] = useState(null);
  
  const [examInfo, setExamInfo] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    durationMinutes: 45,
    passMark: 5,
    startTime: '',
    endTime: '',
    randomizeQuestions: false,
    showAnswersAfterExam: false
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Nếu Giáo viên đã chọn môn trong phần cấu hình bài thi, khóa bộ lọc ngân hàng vào môn đó
  useEffect(() => {
    if (examInfo.subject && examInfo.subject !== '') {
      setFilterSubject(examInfo.subject);
    } else {
      setFilterSubject('All');
    }
  }, [examInfo.subject]);

  // Khóa bộ lọc khối lớp nếu đã chọn trong cấu hình bài thi
  useEffect(() => {
    if (examInfo.grade && examInfo.grade !== '') {
      setFilterGrade(examInfo.grade);
    } else {
      setFilterGrade('All');
    }
  }, [examInfo.grade]);

  // Nếu giáo viên vừa import câu hỏi, tự động điền môn và khối lớp từ dữ liệu import
  useEffect(() => {
    if (importedSource) {
      setExamInfo(prev => ({
        ...prev,
        subject: importedSource.subject || prev.subject,
        grade: importedSource.grade || prev.grade
      }));
    }
  }, [importedSource]);

  const fetchQuestions = async () => {
    try {
      // If the teacher imported questions in the browser, prefer those
      const imported = localStorage.getItem('importedQuestions');
      if (imported) {
        try {
          const parsed = JSON.parse(imported);
          if (Array.isArray(parsed) && parsed.length) {
            setQuestions(parsed);
            // try to read meta
            try {
              const meta = JSON.parse(localStorage.getItem('importedMeta') || 'null');
              if (meta) setImportedSource(meta);
            } catch (e) { /* ignore */ }
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Imported questions malformed', e);
        }
      }

      const res = await fetch('http://localhost:5001/api/questions');
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchSubject = filterSubject === 'All' || q.subject === filterSubject;
    const matchDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    const matchGrade = filterGrade === 'All' || q.grade === filterGrade;
    return matchSubject && matchDifficulty && matchGrade;
  });

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!examInfo.title) return alert('Vui lòng nhập tiêu đề bài thi');
    if (!examInfo.startTime || !examInfo.endTime) return alert('Vui lòng chọn thời gian bắt đầu và kết thúc');
    if (selectedIds.length === 0) return alert('Vui lòng chọn ít nhất 1 câu hỏi từ ngân hàng!');

    const token = localStorage.getItem('token');

    const selectedQuestionsData = questions
      .filter(q => selectedIds.includes(q._id))
      .map(q => ({
        questionText: q.content,
        options: q.options.map(opt => opt.text || opt), 
        correctOption: ['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)
      }));

    const payload = {
      ...examInfo,
      questions: selectedQuestionsData
    };

    try {
      const res = await fetch('http://localhost:5001/api/exams', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': token ? `Bearer ${token}` : '' 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        alert("Tạo bài thi thành công!");
        // Chuyển về trang lịch sử và truyền examId vừa tạo để auto chọn
        navigate('/teacher/history', { state: { selectedExamId: data.examId } });
      } else {
        const errData = await res.json();
        alert(`Lỗi: ${errData.message || 'Không thể tạo bài thi'}`);
      }
    } catch (err) { 
      alert("Lỗi kết nối đến server!"); 
    }
  };

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="create-exam-container">
        <div className="page-header">
          <h2>Tạo Bài Thi Từ Ngân Hàng</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="exam-layout">
          <div className="settings-card">
            <h3 className="card-title">Cấu hình bài thi</h3>

            <div className="form-group">
              <label className="form-label">Tiêu đề bài thi</label>
              <input 
                required 
                type="text" 
                placeholder="Ví dụ: Kiểm tra 1 tiết Toán 12" 
                className="form-control"
                value={examInfo.title} 
                onChange={e => setExamInfo({...examInfo, title: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả / Ghi chú</label>
              <textarea 
                className="form-control"
                placeholder="Nhập hướng dẫn làm bài..." 
                value={examInfo.description} 
                onChange={e => setExamInfo({...examInfo, description: e.target.value})}
              ></textarea>
            </div>

            <div className="row-2-col">
              <div className="form-group">
                <label className="form-label">Môn học</label>
                <select
                  className="form-control"
                  value={examInfo.subject}
                  onChange={e => setExamInfo({...examInfo, subject: e.target.value})}
                >
                  <option value="">Chọn môn</option>
                  <option value="Toán">Toán</option>
                  <option value="Vật Lý">Vật Lý</option>
                  <option value="Hóa Học">Hóa Học</option>
                  <option value="Văn">Văn</option>
                  <option value="Sử">Sử</option>
                  <option value="Địa">Địa</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Sinh Học">Sinh Học</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Khối lớp</label>
                <select
                  className="form-control"
                  value={examInfo.grade}
                  onChange={e => setExamInfo({...examInfo, grade: e.target.value})}
                >
                  <option value="">Chọn khối</option>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>
            </div>

            <div className="row-2-col">
              <div className="form-group">
                <label className="form-label">Thời gian (phút)</label>
                <input 
                  type="number" 
                  min={1} 
                  className="form-control"
                  value={examInfo.durationMinutes} 
                  onChange={e => setExamInfo({...examInfo, durationMinutes: Number(e.target.value)})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Điểm đạt</label>
                <input 
                  type="number" 
                  min={0} 
                  className="form-control"
                  value={examInfo.passMark} 
                  onChange={e => setExamInfo({...examInfo, passMark: Number(e.target.value)})} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Thời gian mở đề</label>
              <input 
                type="datetime-local" 
                required
                className="form-control"
                value={examInfo.startTime} 
                onChange={e => setExamInfo({...examInfo, startTime: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời gian đóng đề</label>
              <input 
                type="datetime-local" 
                required
                className="form-control"
                value={examInfo.endTime} 
                onChange={e => setExamInfo({...examInfo, endTime: e.target.value})} 
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={examInfo.randomizeQuestions} 
                  onChange={e => setExamInfo({...examInfo, randomizeQuestions: e.target.checked})} 
                /> 
                Đảo ngẫu nhiên câu hỏi
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={examInfo.showAnswersAfterExam} 
                  onChange={e => setExamInfo({...examInfo, showAnswersAfterExam: e.target.checked})} 
                /> 
                Hiển thị đáp án sau khi nộp
              </label>
            </div>

            <button type="submit" className="btn-submit">TẠO BÀI THI</button>
          </div>

          <div className="bank-card">
            <div className="bank-header">
              <h3 className="card-title" style={{marginBottom:0, border: 'none'}}>
                Ngân hàng câu hỏi ({questions.length})
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                {importedSource ? (
                  <div style={{fontSize: 13, color: '#6b7280'}}>Nguồn import: {importedSource.fileName} — Khối {importedSource.grade} / {importedSource.subject}</div>
                ) : null}
                <div style={{fontWeight: 600, color: '#00b894', marginTop: 6}}>
                  Đã chọn: {selectedIds.length}
                </div>
              </div>
            </div>

            <div className="bank-filters">
              <select 
                className="filter-select"
                value={filterSubject} 
                onChange={e => setFilterSubject(e.target.value)} 
                disabled={loading || !!examInfo.subject}
              >
                <option value="All">Tất cả môn</option>
                <option value="Toán">Toán</option>
                <option value="Vật Lý">Vật Lý</option>
                <option value="Hóa Học">Hóa Học</option>
                <option value="Văn">Văn</option>
                <option value="Sử">Sử</option>
                <option value="Địa">Địa</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Sinh Học">Sinh Học</option>
              </select>
              <select
                className="filter-select"
                value={filterGrade}
                onChange={e => setFilterGrade(e.target.value)}
                disabled={loading || !!examInfo.grade}
              >
                <option value="All">Tất cả khối</option>
                <option value="10">Khối 10</option>
                <option value="11">Khối 11</option>
                <option value="12">Khối 12</option>
              </select>
              <select 
                className="filter-select"
                value={filterDifficulty} 
                onChange={e => setFilterDifficulty(e.target.value)} 
                disabled={loading}
              >
                <option value="All">Tất cả độ khó</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-spinner">Đang tải câu hỏi...</div>
            ) : (
              <div className="question-list">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map(q => (
                    <div 
                      key={q._id} 
                      className={`question-item ${selectedIds.includes(q._id) ? 'selected' : ''}`}
                      onClick={() => handleCheckboxChange(q._id)}
                    >
                      <input 
                        type="checkbox" 
                        className="q-checkbox"
                        checked={selectedIds.includes(q._id)} 
                        readOnly 
                      />
                      <div className="q-content">
                        <div className="q-tags">
                          <span className="tag subject">{q.subject}</span>
                          <span className="tag grade">{q.grade ? `K${q.grade}` : ''}</span>
                          <span className={`tag ${q.difficulty}`}>{q.difficulty}</span>
                        </div>
                        <div className="q-text">{q.content}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>
                    Không tìm thấy câu hỏi phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExamFromBank;