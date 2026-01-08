import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';
import './CreateExamFromBank.css';

function CreateRandomExam() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    numEasy: 8,
    numMedium: 8,
    numHard: 4,
    totalQuestions: 20,
    preset: '40-40-20' 
  });

  const [previewQuestions, setPreviewQuestions] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/questions');
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (!examInfo.title) return alert('Vui lòng nhập tiêu đề bài thi');
    if (!examInfo.startTime || !examInfo.endTime) return alert('Vui lòng chọn thời gian bắt đầu và kết thúc');

    const desiredEasy = Number(examInfo.numEasy || 0);
    const desiredMedium = Number(examInfo.numMedium || 0);
    const desiredHard = Number(examInfo.numHard || 0);
    const desiredTotal = desiredEasy + desiredMedium + desiredHard;

    if (desiredTotal <= 0) return alert('Vui lòng nhập số câu cho ít nhất một loại câu hỏi.');

    const filtered = questions.filter(q => {
      const matchSubject = !examInfo.subject || examInfo.subject === '' || q.subject === examInfo.subject;
      const matchGrade = !examInfo.grade || examInfo.grade === '' || q.grade === examInfo.grade;
      return matchSubject && matchGrade;
    });

    if (!filtered.length) return alert('Không có câu hỏi phù hợp trong ngân hàng để tạo đề.');

    const pickFromPool = (pool, n) => shuffle(pool).slice(0, n);

    if (!previewQuestions) {
      const poolEasy = filtered.filter(q => q.difficulty === 'easy');
      const poolMedium = filtered.filter(q => q.difficulty === 'medium');
      const poolHard = filtered.filter(q => q.difficulty === 'hard');

      const pickedEasy = pickFromPool(poolEasy, Math.min(desiredEasy, poolEasy.length));
      const pickedMedium = pickFromPool(poolMedium, Math.min(desiredMedium, poolMedium.length));
      const pickedHard = pickFromPool(poolHard, Math.min(desiredHard, poolHard.length));

      let picked = [...pickedEasy, ...pickedMedium, ...pickedHard];

      if (picked.length < desiredTotal) {
        const remainingPool = filtered.filter(q => !picked.find(p => p._id === q._id));
        const need = desiredTotal - picked.length;
        picked = [...picked, ...pickFromPool(remainingPool, Math.min(need, remainingPool.length))];
        if (picked.length < desiredTotal) alert(`Chỉ tìm thấy ${picked.length} câu phù hợp để tạo đề.`);
      }

      if (examInfo.randomizeQuestions) picked = shuffle(picked);
      setPreviewQuestions(picked);
      return;
    }

    const existing = previewQuestions.slice();
    const existingIds = new Set(existing.map(q => q._id));

    const currentEasy = existing.filter(q => q.difficulty === 'easy').length;
    const currentMedium = existing.filter(q => q.difficulty === 'medium').length;
    const currentHard = existing.filter(q => q.difficulty === 'hard').length;

    if (desiredTotal < existing.length) {
      let trimmed = existing.slice(0, desiredTotal);
      if (examInfo.randomizeQuestions) trimmed = shuffle(trimmed);
      setPreviewQuestions(trimmed);
      return;
    }

    const missingEasy = Math.max(0, desiredEasy - currentEasy);
    const missingMedium = Math.max(0, desiredMedium - currentMedium);
    const missingHard = Math.max(0, desiredHard - currentHard);

    let additions = [];

    if (missingEasy > 0) {
      const poolEasy = filtered.filter(q => q.difficulty === 'easy' && !existingIds.has(q._id));
      const add = pickFromPool(poolEasy, Math.min(missingEasy, poolEasy.length));
      additions = additions.concat(add);
      add.forEach(a => existingIds.add(a._id));
    }

    if (missingMedium > 0) {
      const poolMedium = filtered.filter(q => q.difficulty === 'medium' && !existingIds.has(q._id));
      const add = pickFromPool(poolMedium, Math.min(missingMedium, poolMedium.length));
      additions = additions.concat(add);
      add.forEach(a => existingIds.add(a._id));
    }

    if (missingHard > 0) {
      const poolHard = filtered.filter(q => q.difficulty === 'hard' && !existingIds.has(q._id));
      const add = pickFromPool(poolHard, Math.min(missingHard, poolHard.length));
      additions = additions.concat(add);
      add.forEach(a => existingIds.add(a._id));
    }

    let newPreview = existing.concat(additions);

    if (newPreview.length < desiredTotal) {
      const remainingPool = filtered.filter(q => !newPreview.find(p => p._id === q._id));
      const need = desiredTotal - newPreview.length;
      const add = pickFromPool(remainingPool, Math.min(need, remainingPool.length));
      newPreview = newPreview.concat(add);
      if (newPreview.length < desiredTotal) {
        alert(`Chỉ bổ sung được ${newPreview.length - existing.length} câu, tổng hiện tại ${newPreview.length}.`);
      }
    }

    if (examInfo.randomizeQuestions) newPreview = shuffle(newPreview);
    setPreviewQuestions(newPreview);
  }; 

  const handleReRandomize = () => {
    if (!previewQuestions) return;
    const pool = questions.filter(q => {
      const matchSubject = !examInfo.subject || examInfo.subject === '' || q.subject === examInfo.subject;
      const matchGrade = !examInfo.grade || examInfo.grade === '' || q.grade === examInfo.grade;
      return matchSubject && matchGrade;
    });
    const count = Math.min(previewQuestions.length, pool.length);
    setPreviewQuestions(shuffle(pool).slice(0, count));
  };

  const handleRemoveQuestion = (idx) => {
    setPreviewQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreateExam = async () => {
    if (!previewQuestions || previewQuestions.length === 0) return alert('Không có câu hỏi để tạo bài thi');

    const token = localStorage.getItem('token');

    const selectedQuestionsData = previewQuestions.map(q => ({
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
        alert('Tạo bài thi thành công!');
        navigate('/teacher/history', { state: { selectedExamId: data.examId } });
      } else {
        const errData = await res.json();
        alert(`Lỗi: ${errData.message || 'Không thể tạo bài thi'}`);
      }
    } catch (err) {
      alert('Lỗi kết nối đến server!');
    }
  };

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="create-exam-container">
        <div className="page-header">
          <h2>Tạo Bài Thi Ngẫu Nhiên</h2>
        </div>

        <form className="exam-layout" onSubmit={handlePreview}>
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
                <label className="form-label">Tổng số câu</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={examInfo.totalQuestions}
                  onChange={e => {
                    const t = Math.max(0, Number(e.target.value || 0));
                    const preset = examInfo.preset;
                    if (preset && preset !== 'custom') {
                      const [pe, pm, ph] = preset.split('-').map(s => Number(s));
                      const distribute = (t, [a,b,c]) => {
                        const raw = [t * a / 100, t * b / 100, t * c / 100];
                        let ints = raw.map(x => Math.floor(x));
                        let diff = t - ints.reduce((s,v)=>s+v,0);
                        const fracs = raw.map((x,i)=>({i, f: x - Math.floor(x)})).sort((x,y)=>y.f - x.f);
                        for (let k=0; k<diff; k++) ints[fracs[k%fracs.length].i]++;
                        return ints;
                      };
                      const [eCount,mCount,hCount] = distribute(t,[pe,pm,ph]);
                      setExamInfo({...examInfo, totalQuestions: t, numEasy: eCount, numMedium: mCount, numHard: hCount});
                    } else {
                      const curTotal = (examInfo.numEasy || 0) + (examInfo.numMedium || 0) + (examInfo.numHard || 0) || 1;
                      const ratioEasy = (examInfo.numEasy || 0) / curTotal;
                      const ratioMedium = (examInfo.numMedium || 0) / curTotal;
                      const ratioHard = (examInfo.numHard || 0) / curTotal;
                      const raw = [t * ratioEasy, t * ratioMedium, t * ratioHard];
                      let ints = raw.map(x => Math.floor(x));
                      let diff = t - ints.reduce((s,v)=>s+v,0);
                      const fracs = raw.map((x,i)=>({i, f: x - Math.floor(x)})).sort((x,y)=>y.f - x.f);
                      for (let k=0; k<diff; k++) ints[fracs[k%fracs.length].i]++;
                      setExamInfo({...examInfo, totalQuestions: t, numEasy: ints[0], numMedium: ints[1], numHard: ints[2]});
                    }
                  }}
                />
            </div>

            <div style={{display: 'flex', gap: 12}}>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Phân bố</label>
                <select className="form-control" value={examInfo.preset} onChange={e => {
                  const preset = e.target.value;
                  const total = Number(examInfo.totalQuestions || 0) || 0;
                  const [pe, pm, ph] = preset.split('-').map(s => Number(s));
                  const distribute = (t, [a,b,c]) => {
                    const raw = [t * a / 100, t * b / 100, t * c / 100];
                    let ints = raw.map(x => Math.floor(x));
                    let diff = t - ints.reduce((s,v)=>s+v,0);
                    const fracs = raw.map((x,i)=>({i, f: x - Math.floor(x)})).sort((x,y)=>y.f - x.f);
                    for (let k=0; k<diff; k++) ints[fracs[k%fracs.length].i]++;
                    return ints;
                  };
                  if (preset !== 'custom' && total > 0) {
                    const [eCount, mCount, hCount] = distribute(total, [pe,pm,ph]);
                    setExamInfo({...examInfo, preset, numEasy: eCount, numMedium: mCount, numHard: hCount});
                  } else {
                    setExamInfo({...examInfo, preset});
                  }
                }}>
                  <option value="40-40-20">40 - 40 - 20</option>
                  <option value="60-20-20">60 - 20 - 20</option>
                  <option value="60-20-0">60 - 20 - 0</option>
                  <option value="50-50-0">50 - 50 - 0</option>
                  <option value="33-33-34">33 - 33 - 34</option>
                  <option value="20-50-30">20 - 50 - 30</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>

                <div style={{display:'flex', gap:12, alignItems:'center'}}>

                  <div style={{flex:1}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                      <div style={{fontSize:12, color:'#374151'}}>Dễ</div>
                      <div style={{fontSize:12, color:'#374151'}}>{examInfo.numEasy}</div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={examInfo.totalQuestions || 0}
                      value={examInfo.numEasy}
                      disabled={examInfo.preset !== 'custom'}
                      onChange={e => {
                        const v = Number(e.target.value);
                        const newEasy = v;
                        const newMedium = examInfo.numMedium;
                        const newHard = examInfo.numHard;
                        if (examInfo.preset === 'custom') {
                          const total = newEasy + newMedium + newHard;
                          setExamInfo({...examInfo, numEasy: newEasy, totalQuestions: total});
                        }
                      }}
                    />
                  </div>

                  <div style={{flex:1}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                      <div style={{fontSize:12, color:'#374151'}}>Trung bình</div>
                      <div style={{fontSize:12, color:'#374151'}}>{examInfo.numMedium}</div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={examInfo.totalQuestions || 0}
                      value={examInfo.numMedium}
                      disabled={examInfo.preset !== 'custom'}
                      onChange={e => {
                        const v = Number(e.target.value);
                        const newEasy = examInfo.numEasy;
                        const newMedium = v;
                        const newHard = examInfo.numHard;
                        if (examInfo.preset === 'custom') {
                          const total = newEasy + newMedium + newHard;
                          setExamInfo({...examInfo, numMedium: newMedium, totalQuestions: total});
                        }
                      }}
                    />
                  </div>

                  <div style={{flex:1}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                      <div style={{fontSize:12, color:'#374151'}}>Khó</div>
                      <div style={{fontSize:12, color:'#374151'}}>{examInfo.numHard}</div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={examInfo.totalQuestions || 0}
                      value={examInfo.numHard}
                      disabled={examInfo.preset !== 'custom'}
                      onChange={e => {
                        const v = Number(e.target.value);
                        const newEasy = examInfo.numEasy;
                        const newMedium = examInfo.numMedium;
                        const newHard = v;
                        if (examInfo.preset === 'custom') {
                          const total = newEasy + newMedium + newHard;
                          setExamInfo({...examInfo, numHard: newHard, totalQuestions: total});
                        }
                      }}
                    />
                  </div>

                </div>
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

            <div style={{display:'flex', gap: 8, marginTop: 10}}>
              <button type="submit" className="btn-submit">XEM TRƯỚC</button>
              <button type="button" className="btn-ghost" onClick={() => {
                setExamInfo({
                  title: '', description: '', subject: '', grade: '', durationMinutes:45, passMark:5, startTime:'', endTime:'', randomizeQuestions:false, numEasy:8, numMedium:8, numHard:4, totalQuestions:20, preset: '40-40-20'
                });
                setPreviewQuestions(null);
              }}>XÓA</button>
            </div>

          </div>

          <div className="bank-card">
            <div className="bank-header">
              <h3 className="card-title" style={{marginBottom:0, border: 'none'}}>
                Xem trước đề
              </h3>
            </div>

            {previewQuestions ? (
              <div style={{padding: 12}}>
                <div style={{marginBottom:8}}>
                  <div style={{fontWeight:600, color:'#00b894'}}>Câu hỏi: {previewQuestions.length}</div>
                </div>

                <div className="question-list">
                  {previewQuestions.map((q, idx) => (
                    <div key={q._id || idx} className="question-item" style={{cursor:'default'}}>
                      <div className="q-content" style={{width:'100%'}}>
                        <div className="q-tags">
                          <span className="tag subject">{q.subject}</span>
                          <span className="tag grade">{q.grade ? `K${q.grade}` : ''}</span>
                          <span className={`tag ${q.difficulty}`}>{q.difficulty}</span>
                        </div>
                        <div className="q-text">{q.content}</div>
                        <div style={{marginTop:8, display:'flex', gap:8}}>
                          <div style={{color:'#6b7280'}}>Đáp án ví dụ: {q.correctAnswer}</div>
                          <div style={{marginLeft:'auto'}}>
                            <button className="btn-ghost" onClick={() => handleRemoveQuestion(idx)}>Xóa</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" className="btn-ghost" onClick={handleReRandomize} style={{padding: '10px 12px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Sắp xếp lại</button>
                    <button type="button" className="btn-ghost" onClick={() => setPreviewQuestions(null)} style={{padding: '10px 12px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Quay lại</button>
                                        <button type="button" className="btn-submit" onClick={handleCreateExam} style={{margin: 0, width: 'auto', padding: '10px 12px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Tạo bài thi</button>
                </div>

              </div>
            ) : (
              <div style={{textAlign:'center', padding:20, color:'#6b7280'}}>Chưa có đề xem trước. Điền cấu hình bên trái rồi nhấn <strong>XEM TRƯỚC</strong>.</div>
            )}

            {loading && <div className="loading-spinner">Đang tải ngân hàng câu hỏi...</div>}

          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRandomExam;