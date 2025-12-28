const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

const User = require('./models/User');
const Question = require('./models/Question');
const Exam = require('./models/Exam'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
    if (role && user.role !== role) return res.status(403).json({ message: 'Vai trò không hợp lệ' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không đúng' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo câu hỏi', error: err.message });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    const { subject, grade, difficulty } = req.query;
    let filter = {};
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách', error: err.message });
  }
});

app.post('/api/exams', async (req, res) => {
  try {
    const { title, description, startTime, endTime, questionIds, creator } = req.body;
    const selectedQuestions = await Question.find({ _id: { $in: questionIds } });
    if (selectedQuestions.length === 0) {
      return res.status(400).json({ message: 'Không tìm thấy câu hỏi nào được chọn' });
    }
    const examQuestions = selectedQuestions.map(q => ({
      questionText: q.content,
      options: q.options.map(opt => opt.text),
      correctOption: q.correctAnswer === 'A' ? 0 : q.correctAnswer === 'B' ? 1 : q.correctAnswer === 'C' ? 2 : 3
    }));
    const newExam = new Exam({
      title,
      description,
      creator,
      startTime,
      endTime,
      questions: examQuestions
    });
    await newExam.save();
    res.status(201).json({ message: 'Tạo bài thi thành công!', examId: newExam._id });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo bài thi', error: err.message });
  }
});

app.get('/api/exams', async (req, res) => {
  try {
    const exams = await Exam.find().sort({ startTime: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài thi' });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port: ${PORT}`);
});