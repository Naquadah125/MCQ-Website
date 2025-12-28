const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const User = require('./models/User');
const Question = require('./models/Question');
const Exam = require('./models/Exam'); 
const Result = require('./models/Result'); // Đảm bảo model này đã tồn tại

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// --- API MỚI: Lấy danh sách bài thi kèm trạng thái cho học sinh ---
app.get('/api/exams/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    // 1. Lấy tất cả bài thi
    const exams = await Exam.find().sort({ startTime: 1 });
    // 2. Lấy danh sách ID các bài thi mà học sinh này đã làm
    const results = await Result.find({ student: studentId }, 'exam');
    const completedExamIds = results.map(r => r.exam.toString());

    // 3. Gắn thêm thuộc tính isCompleted vào object bài thi
    const examsWithStatus = exams.map(exam => {
      return {
        ...exam._doc,
        isCompleted: completedExamIds.includes(exam._id.toString())
      };
    });

    res.json(examsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài thi', error: err.message });
  }
});

// --- CÁC API CŨ CỦA BẠN (GIỮ NGUYÊN) ---
app.post('/api/results/submit', async (req, res) => {
  try {
    const { examId, studentId, studentAnswers } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' });

    let correctCount = 0;
    const processedAnswers = exam.questions.map((q, index) => {
      const selected = studentAnswers[index];
      const isCorrect = selected === q.correctOption;
      if (isCorrect) correctCount++;
      return {
        questionText: q.questionText,
        selectedOption: selected !== undefined ? selected : -1,
        correctOption: q.correctOption,
        isCorrect: isCorrect
      };
    });

    const score = (correctCount / exam.questions.length) * 10;
    const newResult = new Result({
      student: studentId,
      exam: examId,
      answers: processedAnswers,
      score: Number(score.toFixed(2)),
      totalQuestions: exam.questions.length,
      correctCount: correctCount
    });

    await newResult.save();
    res.status(201).json({ message: 'Nộp bài thành công', score: newResult.score });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lưu kết quả' });
  }
});

app.get('/api/results/student/:studentId', async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('exam', 'title') 
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy dữ liệu' });
  }
});

app.get('/api/teacher/stats', async (req, res) => {
  try {
    const totalExams = await Exam.countDocuments(); // Tổng số bài thi
    const totalQuestions = await Question.countDocuments(); // Tổng số câu hỏi trong ngân hàng
    const totalResults = await Result.countDocuments(); // Tổng số lượt thi đã thực hiện
    
    // Đếm số lượng học sinh duy nhất đã tham gia thi
    const studentsParticipated = await Result.distinct('student');
    
    res.json({
      totalExams,
      totalQuestions,
      totalResults,
      totalStudents: studentsParticipated.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thống kê giáo viên' });
  }
});

// API: Lấy danh sách bài thi mới nhất (Thay thế dữ liệu bảng)
app.get('/api/teacher/recent-exams', async (req, res) => {
  try {
    const exams = await Exam.find()
      .sort({ createdAt: -1 }) // Bài mới tạo hiện lên đầu
      .limit(5); // Lấy 5 bài gần nhất
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bài thi gần đây' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));