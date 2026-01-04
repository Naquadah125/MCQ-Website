import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';
import './CreateQuestion.css';

const REQUIRED_HEADERS = ['grade','class','difficulty','subject','question','a','b','c','d','answer','explanation'];

function parseCSV(text) {
  // Split lines (support CRLF or LF)
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (!lines.length) return { error: 'File trống' };

  // Parse header
  const rawHeaders = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase());

  // Map header indices
  const headerIndex = {};
  rawHeaders.forEach((h, i) => headerIndex[h] = i);

  // Validate required headers exist
  for (const h of REQUIRED_HEADERS) {
    if (!headerIndex.hasOwnProperty(h)) return { error: `Thiếu cột bắt buộc: ${h}` };
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    if (cols.length < rawHeaders.length) continue; // ignore incomplete lines
    const row = {};
    for (const [h, idx] of Object.entries(headerIndex)) {
      row[h] = cols[idx] !== undefined ? cols[idx].trim() : '';
    }
    rows.push(row);
  }

  return { headers: rawHeaders, rows };
}

function splitCSVLine(line) {
  // Split by commas not inside quotes
  const pattern = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
  // This simple approach will work for standard quoted CSV
  const parts = line.split(pattern).map(s => s.replace(/^\"|\"$/g, '').replace(/\"\"/g, '"'));
  return parts;
}

function buildQuestionObjects(rows) {
  return rows.map((r, idx) => ({
    _id: `imp-${Date.now()}-${idx}`,
    content: r.question || '',
    options: [
      { label: 'A', text: r.a || '' },
      { label: 'B', text: r.b || '' },
      { label: 'C', text: r.c || '' },
      { label: 'D', text: r.d || '' }
    ],
    correctAnswer: (r.answer || '').toUpperCase(),
    subject: r.subject || '',
    grade: r.grade || '',
    difficulty: r.difficulty || 'easy',
    explanation: r.explanation || ''
  }));
}

function ImportQuestions() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [rows, setRows] = useState(null);
  const [previewCount, setPreviewCount] = useState(10);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    setError('');
    setRows(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Vui lòng chọn file CSV (định dạng .csv)');
      return;
    }
    setFileName(file.name);
    // If xlsx file, attempt to parse via SheetJS
    if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // dynamic import so app doesn't crash if dependency missing
          const XLSX = (await import('xlsx')).default;
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
          const parsed = parseCSV(csv);
          if (parsed.error) { setError(parsed.error); return; }
          if (!parsed.rows.length) { setError('File không có dòng dữ liệu nào'); return; }
          const grades = Array.from(new Set(parsed.rows.map(r => r.grade)));
          const classes = Array.from(new Set(parsed.rows.map(r => r.class)));
          const subjects = Array.from(new Set(parsed.rows.map(r => r.subject)));
          if (grades.length > 1) return setError(`Các dòng có nhiều khối khác nhau: ${grades.join(', ')}`);
          if (classes.length > 1) return setError(`Các dòng có nhiều lớp khác nhau: ${classes.join(', ')}`);
          if (subjects.length > 1) return setError(`Các dòng có nhiều môn khác nhau: ${subjects.join(', ')}`);
          setRows(parsed.rows);
        } catch (err) {
          console.error('Failed to parse xlsx', err);
          setError('Không thể đọc file .xlsx. Hãy chắc chắn đã cài đặt dependency xlsx.');
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsed = parseCSV(text);
      if (parsed.error) { setError(parsed.error); return; }
      if (!parsed.rows.length) { setError('File không có dòng dữ liệu nào'); return; }

      // validate same grade, class and subject
      const grades = Array.from(new Set(parsed.rows.map(r => r.grade)));
      const classes = Array.from(new Set(parsed.rows.map(r => r.class)));
      const subjects = Array.from(new Set(parsed.rows.map(r => r.subject)));
      if (grades.length > 1) return setError(`Các dòng có nhiều khối khác nhau: ${grades.join(', ')}`);
      if (classes.length > 1) return setError(`Các dòng có nhiều lớp khác nhau: ${classes.join(', ')}`);
      if (subjects.length > 1) return setError(`Các dòng có nhiều môn khác nhau: ${subjects.join(', ')}`);

      setRows(parsed.rows);
    };
    reader.readAsText(file, 'utf-8');
  };

  const confirmImport = () => {
    if (!rows || !rows.length) return setError('Không có dữ liệu để import');
    // Convert rows -> question objects and save to localStorage
    const questions = buildQuestionObjects(rows);
    localStorage.setItem('importedQuestions', JSON.stringify(questions));
    localStorage.setItem('importedMeta', JSON.stringify({ grade: rows[0].grade, class: rows[0].class || '', subject: rows[0].subject, fileName }));
    alert(`Import thành công ${questions.length} câu hỏi (grade ${rows[0].grade}, ${rows[0].subject})`);
    navigate('/teacher/organize/bank');
  };

  return (
    <div className="teacher-bg">
      <TeacherNavbar />
      <div className="create-exam-container">
        <div className="page-header">
          <h2>Import Câu Hỏi (CSV)</h2>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="form-card">
            <div className="form-group">
              <label>Chọn file CSV</label>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={e => handleFile(e.target.files[0])} />
            </div>

            {error && <div className="msg-box error">{error}</div>}

            {rows && (
              <div>
                <div className="msg-box success">File hợp lệ: {rows.length} câu (grade {rows[0].grade}, môn {rows[0].subject})</div>
                <h3>Xem trước các câu hỏi</h3>
                <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid #eee', padding: 10 }}>
                  {rows.slice(0, previewCount).map((r, i) => (
                    <div key={i} style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>
                      <div style={{ fontWeight: 700 }}>{i+1}. {r.question}</div>
                      <div style={{ marginTop: 6 }}>
                        <div>A. {r.a}</div>
                        <div>B. {r.b}</div>
                        <div>C. {r.c}</div>
                        <div>D. {r.d}</div>
                        <div style={{ marginTop: 6, color: '#555' }}>Đáp án: {r.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button className="btn-create" onClick={confirmImport}>Xác nhận import</button>
                  <button className="btn-create" style={{ backgroundColor: '#eee', color: '#333' }} onClick={() => { setRows(null); setFileName(''); }}>Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportQuestions;
