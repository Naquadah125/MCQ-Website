import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentOverview from './pages/Student/StudentOverview';
import StudentNavbar from './components/StudentNavbar';
import TeacherOverview from './pages/Teacher/TeacherOverview';
import TeacherNavbar from './components/TeacherNavbar';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateUser from './pages/admin/CreateUser';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherCreateSelection from './pages/Teacher/TeacherCreateSelection';
import CreateQuestion from './pages/Teacher/CreateQuestion';
import CreateExamFromBank from './pages/Teacher/CreateExamFromBank';
import TeacherOrganizeSelection from './pages/Teacher/TeacherOrganizeSelection';
import StudentExams from './pages/Student/StudentExams';
import './App.css';

const StudentPlaceholder = ({ title }) => (
  <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    <StudentNavbar />
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>{title}</h2>
      <p>Tính năng đang phát triển.</p>
    </div>
  </div>
);

const TeacherPlaceholder = ({ title }) => (
  <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    <TeacherNavbar />
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>{title}</h2>
      <p>Chức năng đang được xây dựng.</p>
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
        <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentOverview /></ProtectedRoute>} />
        <Route path="/student/join" element={<ProtectedRoute allowedRole="student"><StudentExams /></ProtectedRoute>} />
        <Route path="/student/history" element={<ProtectedRoute allowedRole="student"><StudentPlaceholder title="Lịch sử bài thi" /></ProtectedRoute>} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherOverview /></ProtectedRoute>} />
        
        {/* Tổ chức thi Routes */}
        <Route path="/teacher/organize" element={<ProtectedRoute allowedRole="teacher"><TeacherOrganizeSelection /></ProtectedRoute>} />
        <Route path="/teacher/organize/bank" element={<ProtectedRoute allowedRole="teacher"><CreateExamFromBank /></ProtectedRoute>} />
        
        {/* Tạo câu hỏi Routes */}
        <Route path="/teacher/create" element={<ProtectedRoute allowedRole="teacher"><TeacherCreateSelection /></ProtectedRoute>} />
        <Route path="/teacher/create-question" element={<ProtectedRoute allowedRole="teacher"><CreateQuestion /></ProtectedRoute>} />
        <Route path="/teacher/create-exam" element={<ProtectedRoute allowedRole="teacher"><TeacherPlaceholder title="Tạo Bài Thi (Sắp ra mắt)" /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/create-user" element={<ProtectedRoute allowedRole="admin"><CreateUser /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;