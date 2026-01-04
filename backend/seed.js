const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Models
const User = require('./models/User');
const Question = require('./models/Question');
const Exam = require('./models/Exam');
const Result = require('./models/Result');

dotenv.config();

const seedData = async () => {
  try {
    // 1. Kết nối DB
    await connectDB();

    // 2. Xóa sạch dữ liệu cũ (Users, Questions, Exams, Results)
    await User.deleteMany({});
    await Question.deleteMany({});
    await Exam.deleteMany({});
    await Result.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // 3. Tạo duy nhất 1 user admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt); // Mật khẩu seed mặc định: 123

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      password: hashedPassword
    });

    await adminUser.save();

    console.log('Đã tạo user admin duy nhất: admin@test.com (password: 123)');

    // Tạo 1 user teacher để gán làm creator cho các exams demo
    const teacherUser = new User({
      name: 'Demo Teacher',
      email: 'teacher@test.com',
      role: 'teacher',
      password: hashedPassword
    });
    await teacherUser.save();
    console.log('Đã tạo user teacher demo: teacher@test.com (password: 123)');

    // --- TẠO DỮ LIỆU MẪU: 3 case trạng thái (upcoming / ongoing / finished) ---
    const now = new Date();

    // Các câu hỏi mẫu (đơn giản)
    const sampleQuestions = [
      {
        questionText: '1 + 1 = ?',
        options: ['1','2','3','4'],
        correctOption: 1
      },
      {
        questionText: '2 + 2 = ?',
        options: ['2','3','4','5'],
        correctOption: 2
      },
      {
        questionText: '3 + 3 = ?',
        options: ['5','6','7','8'],
        correctOption: 1
      }
    ];

    // Upcoming: start in 2 days
    const upcomingExam = new Exam({
      title: 'Kiểm tra sắp tới (Upcoming)',
      description: 'Bài thi sắp xảy ra',
      subject: 'Toán',
      grade: '11',
      durationMinutes: 30,
      startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      questions: sampleQuestions,
      creator: teacherUser._id
    });

    // Ongoing: started 30 minutes ago, ends in 30 minutes
    const ongoingExam = new Exam({
      title: 'Kiểm tra đang diễn ra (Ongoing)',
      description: 'Bài thi đang diễn ra',
      subject: 'Vật Lý',
      grade: '12',
      durationMinutes: 60,
      startTime: new Date(now.getTime() - 30 * 60 * 1000),
      endTime: new Date(now.getTime() + 30 * 60 * 1000),
      questions: sampleQuestions,
      creator: teacherUser._id
    });

    // Finished: ended 2 days ago
    const finishedExam = new Exam({
      title: 'Kiểm tra đã kết thúc (Finished)',
      description: 'Bài thi đã kết thúc',
      subject: 'Hóa Học',
      grade: '12',
      durationMinutes: 45,
      startTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      questions: sampleQuestions,
      creator: teacherUser._id
    });

    await upcomingExam.save();
    await ongoingExam.save();
    await finishedExam.save();

    console.log('Đã tạo 3 exams demo: upcoming, ongoing, finished');

    // Tạo user student và 1 kết quả (mark finishedExam as completed for that student)
    const studentUser = new User({
      name: 'Demo Student',
      email: 'student@test.com',
      role: 'student',
      password: hashedPassword
    });
    await studentUser.save();

    const sampleResult = new Result({
      student: studentUser._id,
      exam: finishedExam._id,
      answers: finishedExam.questions.map((q, i) => ({
        questionText: q.questionText,
        selectedOption: q.correctOption,
        correctOption: q.correctOption,
        isCorrect: true
      })),
      score: 10,
      totalQuestions: finishedExam.questions.length,
      correctCount: finishedExam.questions.length,
      completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1000)
    });
    await sampleResult.save();

    console.log('Đã tạo user student demo: student@test.com và 1 kết quả (finished exam)');
    console.log('-----------------------------------');
    console.log('Hoàn tất quá trình Seed.');
    process.exit();
  } catch (error) {
    console.error('Lỗi seed data:', error);
    process.exit(1);
  }
};

seedData();