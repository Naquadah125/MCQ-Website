import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';

function CreateExamFromBank() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho bộ lọc
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  
  const [examInfo, setExamInfo] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => console.error("Lỗi tải câu hỏi:", err));
  }, []);

  // Hàm xử lý lọc danh sách
  const filteredQuestions = questions.filter(q => {
    const matchSubject = filterSubject === 'All' || q.subject === filterSubject;
    const matchDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    return matchSubject && matchDifficulty;
  });

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return alert("Vui lòng chọn ít nhất 1 câu hỏi!");
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const payload = { ...examInfo, questionIds: selectedIds, creator: user?.id };
    try {
      const res = await fetch('http://localhost:5001/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Tạo bài thi thành công!");
        navigate('/teacher');
      }
    } catch (err) { alert("Lỗi kết nối!"); }
  };

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Tạo bài thi từ Ngân hàng</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
          {/* Cột trái: Form thông tin bài thi (Giữ nguyên) */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', height: 'fit-content', position: 'sticky', top: '90px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
             <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên bài thi</label>
              <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                onChange={e => setExamInfo({...examInfo, title: e.target.value})} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mô tả</label>
              <textarea rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                onChange={e => setExamInfo({...examInfo, description: e.target.value})}></textarea>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bắt đầu</label>
              <input type="datetime-local" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                onChange={e => setExamInfo({...examInfo, startTime: e.target.value})} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kết thúc</label>
              <input type="datetime-local" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                onChange={e => setExamInfo({...examInfo, endTime: e.target.value})} />
            </div>
            <p style={{ color: '#00b894', fontWeight: 'bold' }}>Đã chọn: {selectedIds.length} câu</p>
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              XÁC NHẬN TẠO BÀI
            </button>
          </div>

          {/* Cột phải: Danh sách câu hỏi có Filter */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Chọn câu hỏi</h3>
              
              {/* Filter Dropdowns nằm bên phải */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={filterSubject} 
                  onChange={(e) => setFilterSubject(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                >
                  <option value="All">Tất cả môn</option>
                  <option value="Toán">Toán</option>
                  <option value="Vật Lý">Vật Lý</option>
                  <option value="Hóa Học">Hóa Học</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                </select>

                <select 
                  value={filterDifficulty} 
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                >
                  <option value="All">Tất cả độ khó</option>
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
            </div>

            {loading ? <p>Đang tải câu hỏi...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <div 
                      key={q._id} 
                      style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        padding: '15px', 
                        border: '1px solid #eee', 
                        borderRadius: '10px', 
                        background: selectedIds.includes(q._id) ? '#f0fff4' : 'white',
                        transition: '0.2s',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleCheckboxChange(q._id)}
                    >
                      <input 
                        type="checkbox" 
                        style={{ width: '18px', cursor: 'pointer' }} 
                        checked={selectedIds.includes(q._id)}
                        readOnly
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', background: '#e6f0ff', color: '#0066ff', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                            {q.subject}
                          </span>
                          <span style={{ 
                            fontSize: '11px', 
                            background: q.difficulty === 'easy' ? '#dcfce7' : q.difficulty === 'hard' ? '#fee2e2' : '#fef9c3', 
                            color: q.difficulty === 'easy' ? '#15803d' : q.difficulty === 'hard' ? '#b91c1c' : '#854d0e', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#333', fontWeight: '500', lineHeight: '1.4' }}>{q.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Không tìm thấy câu hỏi phù hợp.</p>
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