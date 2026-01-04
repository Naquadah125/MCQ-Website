require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// Import Models
const User = require('./models/User');
const Profile = require('./models/Profile'); // MODEL MỚI
const Question = require('./models/Question');
const Exam = require('./models/Exam'); 

const Result = require('./models/Result');
// Audit Log
const auditLogRoutes = require('./routes/auditLog');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();


app.use(cors());
app.use(express.json());

// API Audit Log
app.use('/api/audit-log', auditLogRoutes);

// --- MIDDLEWARE XÁC THỰC (Dùng để lấy thông tin cá nhân an toàn) ---
const authorize = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'Bạn cần đăng nhập' });

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Không có quyền truy cập' });
            }
            req.user = decoded; // Lưu id và role vào req.user
            next();
        } catch (err) {
            res.status(401).json({ message: 'Token không hợp lệ' });
        }
    };
};

// --- 1. ĐĂNG KÝ (Sửa lại để tạo cả Profile) ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role, fullName, phoneNumber, ...otherProfileInfo } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

        // Tạo User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword, role });
        const savedUser = await newUser.save();

        // Tạo Profile liên kết với User vừa tạo
        const newProfile = new Profile({
            user: savedUser._id,
            fullName: fullName || name, // Nếu không gửi fullName thì lấy tạm name
            phoneNumber,
            ...otherProfileInfo
        });
        await newProfile.save();

        // Ghi log: đăng ký
        try {
          const AuditLog = require('./models/AuditLog');
          const created = await AuditLog.create({
            user: name || email,
            action: 'Đăng ký',
            detail: `Tạo tài khoản: ${name} (${email})`,
            time: new Date()
          });
          console.log('[AuditLog] registered:', name || email);
        } catch (e) {
          console.error('[AuditLog] failed to record registration:', e);
        }

        res.status(201).json({ message: 'Đăng ký tài khoản và hồ sơ thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

// --- 2. LẤY THÔNG TIN CÁ NHÂN (Profile) ---
app.get('/api/profile/me', authorize(), async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'email', 'role']);
        
        if (!profile) return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// --- 3. CẬP NHẬT THÔNG TIN CÁ NHÂN ---
app.put('/api/profile/me', authorize(), async (req, res) => {
    try {
        const updates = req.body || {};

    // If client provided a top-level `name` or `fullName`, ensure the User.name
    // is updated and normalize it to `fullName` for the Profile document.
    if (updates.name || updates.fullName) {
      const newName = updates.name || updates.fullName;
      try {
        await User.findByIdAndUpdate(req.user.id, { $set: { name: newName } });
      } catch (e) {
        console.error('Failed to update user name:', e);
        return res.status(500).json({ message: 'Lỗi khi cập nhật tên người dùng' });
      }
      updates.fullName = newName;
      delete updates.name; // keep profile field consistent
    }

    // Những trường không cho phép cập nhật từ client qua trang chỉnh sửa này
    const forbidden = ['address', 'bio', 'studentId', 'class'];
    forbidden.forEach(f => delete updates[f]);

        // Nếu gửi password mới thì cập nhật vào User (hash trước khi lưu)
        if (updates.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(updates.password, salt);
                await User.findByIdAndUpdate(req.user.id, { $set: { password: hashed } });
                // remove password so it won't be saved into Profile
                delete updates.password;
            } catch (e) {
                console.error('Failed to update password:', e);
                return res.status(500).json({ message: 'Lỗi khi cập nhật mật khẩu' });
            }
        }

        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: updates },
            { new: true, upsert: true }
        );
        res.json({ message: 'Cập nhật thành công', profile });
    } catch (err) {
        console.error('Profile update failed:', err);
        res.status(500).json({ message: 'Lỗi cập nhật hồ sơ' });
    }
});

// --- CÁC ROUTE AUTH KHÁC ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
    if (role && user.role !== role) return res.status(403).json({ message: 'Vai trò không hợp lệ' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không đúng' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

    // Ghi log hoạt động nếu không phải admin
    if (user.role !== 'admin') {
      try {
        const AuditLog = require('./models/AuditLog');
        const created = await AuditLog.create({
          user: user.name,
          action: 'Đăng nhập',
          detail: `Người dùng đăng nhập vào hệ thống`,
          time: new Date()
        });
        console.log('[AuditLog] login recorded for user:', user.name, 'id:', user._id);
      } catch (e) {
        console.error('[AuditLog] failed to record login:', e);
      }
    }

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// --- QUẢN LÝ CÂU HỎI & KỲ THI (Giữ nguyên của bạn) ---
app.post('/api/questions', authorize(['teacher','admin']), async (req, res) => {
  try {
    const payload = req.body;
    const newQuestion = new Question(payload);
    const savedQuestion = await newQuestion.save();

    // Audit log
    try {
      const AuditLog = require('./models/AuditLog');
      const user = req.user && req.user.id ? await User.findById(req.user.id) : null;
      await AuditLog.create({ user: user ? user.name : 'Unknown', action: 'Tạo câu hỏi', detail: `Tạo câu hỏi: ${savedQuestion._id}`, time: new Date() });
      console.log('[AuditLog] question created by', user ? user.name : 'Unknown');
    } catch (e) { console.error('[AuditLog] failed to log question create', e); }

    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo câu hỏi', error: err.message });
  }
});

app.put('/api/questions/:id', authorize(['teacher','admin']), async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });

    try {
      const AuditLog = require('./models/AuditLog');
      const user = req.user && req.user.id ? await User.findById(req.user.id) : null;
      await AuditLog.create({ user: user ? user.name : 'Unknown', action: 'Cập nhật câu hỏi', detail: `Cập nhật câu hỏi: ${updated._id}`, time: new Date() });
      console.log('[AuditLog] question updated by', user ? user.name : 'Unknown');
    } catch (e) { console.error('[AuditLog] failed to log question update', e); }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật câu hỏi', error: err.message });
  }
});

app.delete('/api/questions/:id', authorize(['teacher','admin']), async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });

    try {
      const AuditLog = require('./models/AuditLog');
      const user = req.user && req.user.id ? await User.findById(req.user.id) : null;
      await AuditLog.create({ user: user ? user.name : 'Unknown', action: 'Xóa câu hỏi', detail: `Xóa câu hỏi: ${deleted._id}`, time: new Date() });
      console.log('[AuditLog] question deleted by', user ? user.name : 'Unknown');
    } catch (e) { console.error('[AuditLog] failed to log question delete', e); }

    res.json({ message: 'Xóa câu hỏi thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa câu hỏi', error: err.message });
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

app.post('/api/exams', authorize(['teacher','admin']), async (req, res) => {
  try {
    // Force creator to be the authenticated user for security
    const creatorId = req.user && req.user.id ? req.user.id : req.body.creator;
    const { title, description, startTime, endTime, questionIds, questions: providedQuestions, subject, grade, durationMinutes, passMark, randomizeQuestions, showAnswersAfterExam, status } = req.body;

    let examQuestions = [];

    // If questionIds provided, load from bank
    if (questionIds && Array.isArray(questionIds) && questionIds.length > 0) {
      const selectedQuestions = await Question.find({ _id: { $in: questionIds } });
      if (selectedQuestions.length === 0) {
        return res.status(400).json({ message: 'Không tìm thấy câu hỏi nào được chọn' });
      }
      examQuestions = selectedQuestions.map(q => ({
        questionText: q.content,
        options: q.options.map(opt => opt.text),
        correctOption: q.correctAnswer === 'A' ? 0 : q.correctAnswer === 'B' ? 1 : q.correctAnswer === 'C' ? 2 : 3
      }));
    } else if (providedQuestions && Array.isArray(providedQuestions) && providedQuestions.length > 0) {
      // Allow creating exam directly from provided question objects
      examQuestions = providedQuestions.map(q => ({
        questionText: q.questionText || q.content || '',
        options: q.options || q.options || [],
        correctOption: typeof q.correctOption === 'number' ? q.correctOption : 0
      }));
    } else {
      return res.status(400).json({ message: 'Không tìm thấy câu hỏi nào để tạo bài thi' });
    }

    const newExam = new Exam({
      title,
      description,
      creator: creatorId,
      subject,
      grade,
      durationMinutes,
      passMark,
      randomizeQuestions,
      showAnswersAfterExam,
      status,
      startTime,
      endTime,
      questions: examQuestions
    });
    await newExam.save();

    // Ghi log hoạt động
    try {
      const AuditLog = require('./models/AuditLog');
      const user = req.user && req.user.id ? await User.findById(req.user.id) : null;
      const created = await AuditLog.create({
        user: user ? user.name : 'Unknown',
        action: 'Tạo bài thi',
        detail: `Tạo bài thi: ${title}`,
        time: new Date()
      });
      console.log('[AuditLog] exam created by:', user ? user.name : 'Unknown', 'exam:', newExam._id);
    } catch (e) {
      console.error('[AuditLog] failed to record exam creation:', e);
    }

    res.status(201).json({ message: 'Tạo bài thi thành công!', examId: newExam._id });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo bài thi', error: err.message });
  }
});

app.get('/api/exams', async (req, res) => {
  try {
    const { subject, grade, status, title } = req.query;
    let filter = {};
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: 'i' };

    const exams = await Exam.find(filter).sort({ startTime: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài thi' });
  }
});

// Teacher-specific exam routes removed: exam management is admin-only now.

// Admin-specific exam endpoints
app.get('/api/exams/:id', authorize(['teacher','admin']), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy bài thi' });
  }
});

app.put('/api/admin/exams/:id', authorize(['teacher','admin']), async (req, res) => {
  try {
    const updates = req.body;
    if (updates.questionIds) {
      const selectedQuestions = await Question.find({ _id: { $in: updates.questionIds } });
      updates.questions = selectedQuestions.map(q => ({ questionText: q.content, options: q.options.map(opt => opt.text), correctOption: q.correctAnswer === 'A' ? 0 : q.correctAnswer === 'B' ? 1 : q.correctAnswer === 'C' ? 2 : 3 }));
      delete updates.questionIds;
    }
    const exam = await Exam.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' });
    res.json({ message: 'Cập nhật bài thi thành công', exam });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật bài thi', error: err.message });
  }
});

app.delete('/api/admin/exams/:id', authorize(['teacher','admin']), async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy bài thi' });
    res.json({ message: 'Xóa bài thi thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa bài thi' });
  }
});

app.get('/api/exams/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const exams = await Exam.find().sort({ startTime: 1 });
    const results = await Result.find({ student: studentId }, 'exam');
    const completedExamIds = results.map(r => r.exam.toString());

    const examsWithStatus = exams.map(exam => ({
      ...exam._doc,
      isCompleted: completedExamIds.includes(exam._id.toString())
    }));

    res.json(examsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài thi', error: err.message });
  }
});

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

    // Ghi log: tham gia / nộp bài thi
    try {
      const AuditLog = require('./models/AuditLog');
      const studentUser = studentId ? await User.findById(studentId) : null;
      const examTitle = exam ? (exam.title || String(exam._id)) : examId;
      await AuditLog.create({
        user: studentUser ? studentUser.name : (studentId || 'Unknown'),
        action: 'Tham gia thi',
        detail: `Nộp bài: ${examTitle}, Điểm: ${Number(score.toFixed(2))}`,
        time: new Date()
      });
      console.log('[AuditLog] exam submitted by:', studentUser ? studentUser.name : studentId, 'exam:', examTitle);
    } catch (e) {
      console.error('[AuditLog] failed to record exam submission:', e);
    }

    res.status(201).json({ message: 'Nộp bài thành công', score: newResult.score });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lưu kết quả' });
  }
});

app.get('/api/results/student/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const results = await Result.find({ student: studentId })
      .populate('exam', 'title durationMinutes')
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy dữ liệu' });
  }
});

// Get single result by id (include full exam details for review)
app.get('/api/results/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await Result.findById(resultId).populate('exam');
    if (!result) return res.status(404).json({ message: 'Không tìm thấy kết quả' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy kết quả' });
  }
});

// Thống kê & Bài thi gần đây (Giữ nguyên)
app.get('/api/teacher/stats', async (req, res) => {
  try {
    const totalExams = await Exam.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalResults = await Result.countDocuments();
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

// Thống kê admin (Tổng người dùng / theo role / tổng bài thi)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalExams = await Exam.countDocuments();

    res.json({
      totalUsers,
      totalTeachers,
      totalStudents,
      totalExams
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thống kê admin' });
  }
});

// Admin users list & delete
app.get('/api/admin/users', authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
});

app.delete('/api/admin/users/:id', authorize(['admin']), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
  }
});

// --- CẬP NHẬT THÔNG TIN NGƯỜI DÙNG (Admin) ---
app.put('/api/admin/users/:id', authorize(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, profile } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    // Nếu đổi email, kiểm tra trùng
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email đã được sử dụng bởi tài khoản khác' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    // Nếu gửi password trong payload, cập nhật mật khẩu (hash trước khi lưu)
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        user.password = hashed;
      } catch (e) {
        console.error('Failed to hash password for admin update:', e);
        return res.status(500).json({ message: 'Lỗi khi cập nhật mật khẩu' });
      }
    }

    await user.save();

    // Cập nhật hoặc tạo profile liên quan
    let profileDoc = await Profile.findOne({ user: user._id });
    if (!profileDoc) {
      profileDoc = new Profile({ user: user._id, fullName: (profile && profile.fullName) ? profile.fullName : user.name, ...(profile || {}) });
    } else if (profile && typeof profile === 'object') {
      Object.keys(profile).forEach(k => {
        profileDoc[k] = profile[k];
      });
    }
    profileDoc.updatedAt = Date.now();
    await profileDoc.save();

    // Ghi log hoạt động
    try {
      const AuditLog = require('./models/AuditLog');
      const adminUser = req.user && req.user.id ? await User.findById(req.user.id) : null;
      const created = await AuditLog.create({
        user: adminUser ? adminUser.name : 'Admin',
        action: 'Cập nhật user',
        detail: `Cập nhật thông tin user: ${user.name} (${user.email})`,
        time: new Date()
      });
      console.log('[AuditLog] user updated by:', adminUser ? adminUser.name : 'Admin', 'target:', user.email);
    } catch (e) {
      console.error('[AuditLog] failed to record user update:', e);
    }

    res.json({ message: 'Cập nhật người dùng thành công', user: { id: user._id, name: user.name, email: user.email, role: user.role }, profile: profileDoc });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
  }
});

// Đặt lại mật khẩu cho user (admin only)
app.put('/api/admin/users/:id/reset-password', authorize(['admin']), async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu mới' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    user.password = hashed;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đặt lại mật khẩu' });
  }
});

app.get('/api/teacher/recent-exams', async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 }).limit(5);
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bài thi gần đây' });
  }
});

app.get('/api/results/exam/:examId', async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('student', 'name email')
      .sort({ score: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách điểm" });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port: ${PORT}`);
});