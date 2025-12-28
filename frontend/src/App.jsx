import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentOverview from './pages/Student/StudentOverview';
import StudentNavbar from './components/StudentNavbar';
import TeacherOverview from './pages/teacher/TeacherOverview';
import TeacherNavbar from './components/TeacherNavbar';
import './App.css';

// Placeholder cho Student
const StudentPlaceholder = ({ title }) => (
  <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    <StudentNavbar />
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>{title}</h2>
      <p>Tính năng đang phát triển.</p>
    </div>
  </div>
);

// Placeholder cho Teacher
const TeacherPlaceholder = ({ title }) => (
  <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    <TeacherNavbar />
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>{title}</h2>
      <p>Chức năng dành cho giáo viên đang được xây dựng.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/features" element={<><Navbar /><Features /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /></>} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentOverview />} />
        <Route path="/student/join" element={<StudentPlaceholder title="Tham gia thi" />} />
        <Route path="/student/history" element={<StudentPlaceholder title="Lịch sử bài thi" />} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherOverview />} />
        <Route path="/teacher/organize" element={<TeacherPlaceholder title="Tổ chức thi" />} />
        <Route path="/teacher/create" element={<TeacherPlaceholder title="Tạo bài thi" />} />
      </Routes>
    </Router>
  );
}

export default App;