import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentOverview from './pages/Student/StudentOverview';
import StudentNavbar from './components/StudentNavbar';
import TeacherOverview from './pages/teacher/TeacherOverview';
import TeacherNavbar from './components/TeacherNavbar';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateUser from './pages/Admin/CreateUser';
import ProtectedRoute from './components/ProtectedRoute';
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
      <p>Chức năng dành cho giáo viên đang được xây dựng.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/features" element={<><Navbar /><Features /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /></>} />

        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentOverview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/join" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentPlaceholder title="Tham gia thi" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/history" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentPlaceholder title="Lịch sử bài thi" />
            </ProtectedRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherOverview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/organize" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherPlaceholder title="Tổ chức thi" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/create" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherPlaceholder title="Tạo bài thi" />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/create-user" 
          element={
            <ProtectedRoute allowedRole="admin">
              <CreateUser />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;