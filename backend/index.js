require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db'); 
const User = require('./models/user');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// --- 1. ROUTE ĐĂNG KÝ (Register) ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Kiểm tra user đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email này đã được đăng ký" });

    // Tạo user mới (mặc định là student nếu không gửi role)
    user = new User({ 
      username, 
      email, 
      password, 
      role: role || 'student' 
    });

    await user.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- 2. ROUTE ĐĂNG NHẬP (Login) ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });

    // Tạo mã Token (JWT) chứa ID và Role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'BiMatQuanTrong123',
      { expiresIn: '1d' }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// --- 3. MIDDLEWARE KIỂM TRA QUYỀN (Authorize) ---
const authorize = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Bạn cần đăng nhập" });

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'BiMatQuanTrong123');

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập khu vực này" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
};

// --- 4. CÁC ĐƯỜNG DẪN KIỂM TRA PHÂN QUYỀN ---
app.get('/api/admin/dashboard', authorize(['admin']), (req, res) => {
  res.json({ message: "Chào Admin! Đây là trang quản lý hệ thống." });
});

app.get('/api/teacher/quiz', authorize(['teacher', 'admin']), (req, res) => {
  res.json({ message: "Chào Giáo viên! Bạn có thể tạo câu hỏi ở đây." });
});

app.get('/', (req, res) => {
  res.send('Server và Database đã sẵn sàng!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port: ${PORT}`);
});

const Exam = require('./models/Exam');

// --- 5. ROUTE CHO GIÁO VIÊN & ADMIN: TẠO KỲ THI ---
app.post('/api/exams', authorize(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description, startTime, endTime, questions } = req.body;

    const newExam = new Exam({
      title,
      description,
      startTime,
      endTime,
      questions,
      creator: req.user.id
    });

    await newExam.save();
    res.status(201).json({ message: "Tạo kỳ thi thành công!", exam: newExam });
  } catch (err) {
    res.status(500).json({ message: "Không thể tạo kỳ thi", error: err.message });
  }
});

// --- 6. ROUTE CHO HỌC SINH: XEM DANH SÁCH KỲ THI ---
// Học sinh, Giáo viên hay Admin đều có thể xem danh sách này
app.get('/api/exams', authorize(['student', 'teacher', 'admin']), async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find().sort({ startTime: 1 });

    const categorizedExams = {
      ongoing: exams.filter(e => e.startTime <= now && e.endTime >= now),
      upcoming: exams.filter(e => e.startTime > now),                  
      finished: exams.filter(e => e.endTime < now)                     
    };

    res.json(categorizedExams);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách kỳ thi" });
  }
});

// --- 7. XEM CHI TIẾT 1 KỲ THI ĐỂ LÀM BÀI ---
app.get('/api/exams/:id', authorize(['student', 'teacher', 'admin']), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Không tìm thấy kỳ thi" });
    
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

const Result = require('./models/Result');

app.post('/api/exams/submit', authorize(['student']), async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const exam = await Exam.findById(examId);

    if (!exam) return res.status(404).json({ message: "Không tìm thấy kỳ thi" });

    // --- Logic Chấm điểm ---
    let correctCount = 0;
    exam.questions.forEach((question, index) => {

      const studentAnswer = answers.find(a => a.questionId === question._id.toString());
      if (studentAnswer && studentAnswer.selectedOption === question.correctOption) {
        correctCount++;
      }
    });

    const score = (correctCount / exam.questions.length) * 10;

    const finalResult = new Result({
      student: req.user.id,
      exam: examId,
      answers,
      score
    });

    await finalResult.save();
    res.json({ message: "Nộp bài thành công!", score: score.toFixed(2), totalCorrect: correctCount });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi nộp bài", error: err.message });
  }
});