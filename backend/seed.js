const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Models
const User = require('./models/User');
const Question = require('./models/Question');
const Exam = require('./models/Exam');
const Result = require('./models/Result');

// Import Dữ liệu mẫu
const { users, questions } = require('./data/sampleData');

dotenv.config();

const seedData = async () => {
  try {
    // 1. Kết nối DB
    await connectDB();
    
    // 2. Xóa sạch dữ liệu cũ
    await User.deleteMany({});
    await Question.deleteMany({});
    // Xóa Exam và Result để đảm bảo seed tạo lại trạng thái mong muốn
    await Exam.deleteMany({});
    await Result.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // 3. Tạo Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt); // Mật khẩu chung là 123

    // Duyệt qua mảng users từ file data và tạo user mới
    // Chúng ta dùng Promise.all để tạo song song cho nhanh
    const createdUsers = await Promise.all(users.map(async (userData) => {
      const newUser = new User({
        ...userData,
        password: hashedPassword
      });
      return await newUser.save();
    }));
    
    console.log('Đã tạo Users thành công');

    // 4. Tìm tài khoản Giáo viên để gán quyền tác giả cho câu hỏi
    const teacherUser = createdUsers.find(user => user.role === 'teacher');

    if (!teacherUser) {
      throw new Error("Không tìm thấy user có role 'teacher' trong dữ liệu mẫu");
    }

    // 5. Gán author ID vào danh sách câu hỏi và lưu vào DB
    const questionsWithAuthor = questions.map(question => ({
      ...question,
      author: teacherUser._id // Tự động lấy ID của giáo viên vừa tạo
    }));

    // Tạo thêm câu hỏi tự động: đảm bảo ít nhất 10 câu cho mỗi môn và 10 câu cho mỗi khối (10/11/12)
    const subjects = ['Toán','Vật Lý','Hóa Học','Văn','Sử','Địa','Tiếng Anh','Sinh Học'];
    const grades = ['10','11','12'];
    const difficulties = ['easy','medium','hard'];
    const generatedQuestions = [];

    subjects.forEach(subject => {
      grades.forEach(grade => {
        for (let i = 1; i <= 10; i++) {
          const difficulty = difficulties[(i - 1) % difficulties.length];
          const correctIdx = (i - 1) % 4; // 0..3
          const options = [
            { key: 'A', text: `${subject} ${grade} - Đáp án A câu ${i}` },
            { key: 'B', text: `${subject} ${grade} - Đáp án B câu ${i}` },
            { key: 'C', text: `${subject} ${grade} - Đáp án C câu ${i}` },
            { key: 'D', text: `${subject} ${grade} - Đáp án D câu ${i}` }
          ];

          generatedQuestions.push({
            subject,
            grade,
            difficulty,
            content: `${subject} ${grade} - Câu hỏi mẫu số ${i}`,
            options,
            correctAnswer: ['A','B','C','D'][correctIdx],
            explanation: `Đáp án đúng là ${['A','B','C','D'][correctIdx]} (mục đích seed).`, 
            author: teacherUser._id
          });
        }
      });
    });

    const allQuestions = [...questionsWithAuthor, ...generatedQuestions];
    await Question.insertMany(allQuestions);
    console.log('Đã tạo Câu hỏi mẫu thành công (', allQuestions.length, 'câu )');

    // 6. Tạo 2 bài kiểm tra mẫu và kết quả tương ứng
    const studentA = createdUsers.find(u => u.email === 'studentA@test.com');
    const studentB = createdUsers.find(u => u.email === 'studentB@test.com');

    if (!studentA || !studentB) {
      throw new Error('Không tìm thấy học sinh mẫu (studentA hoặc studentB)');
    }

    // Exam 1: (đã hoàn thành) — trạng thái lưu trong `status`, title không chứa nhãn
    const exam1 = new Exam({
      title: 'Bài kiểm tra Toán',
      description: 'Bài kiểm tra mẫu đã hoàn thành bởi 2 học sinh',
      creator: teacherUser._id,
      subject: 'Toán',
      grade: '12',
      durationMinutes: 30,
      passMark: 5,
      randomizeQuestions: false,
      showAnswersAfterExam: true,
      status: 'Đã kết thúc', // đã hoàn thành
      startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
      endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 ngày trước
      questions: [
        {
          questionText: 'Đạo hàm của x^2 là?',
          options: ['2x','x','2','x^3/3'],
          correctOption: 0
        },
        {
          questionText: 'Nguyên hàm của cos(x) là?',
          options: ['-sin(x)','sin(x)','cos(x)','-cos(x)'],
          correctOption: 1
        }
      ]
    });

    const savedExam1 = await exam1.save();

    // Tạo kết quả cho cả 2 học sinh cho exam1
    const answersA = [
      { questionText: 'Đạo hàm của x^2 là?', selectedOption: 0, correctOption: 0, isCorrect: true },
      { questionText: 'Nguyên hàm của cos(x) là?', selectedOption: 1, correctOption: 1, isCorrect: true }
    ];
    const resultA = new Result({
      student: studentA._id,
      exam: savedExam1._id,
      answers: answersA,
      score: 2,
      totalQuestions: 2,
      correctCount: 2,
      completedAt: new Date()
    });

    const answersB = [
      { questionText: 'Đạo hàm của x^2 là?', selectedOption: 0, correctOption: 0, isCorrect: true },
      { questionText: 'Nguyên hàm của cos(x) là?', selectedOption: 2, correctOption: 1, isCorrect: false }
    ];
    const resultB = new Result({
      student: studentB._id,
      exam: savedExam1._id,
      answers: answersB,
      score: 1,
      totalQuestions: 2,
      correctCount: 1,
      completedAt: new Date()
    });

    await resultA.save();
    await resultB.save();

    // Exam 2: (hết hạn) — title không chứa nhãn, trạng thái = 'Đã kết thúc'
    const exam2 = new Exam({
      title: 'Bài kiểm tra Vật Lý',
      description: 'Bài kiểm tra mẫu đã hết hạn (chưa làm bởi Học Sinh B)',
      creator: teacherUser._id,
      subject: 'Vật Lý',
      grade: '10',
      durationMinutes: 20,
      passMark: 5,
      randomizeQuestions: false,
      showAnswersAfterExam: false,
      status: 'Đã kết thúc', // hết hạn
      startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 ngày trước
      endTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 ngày trước
      questions: [
        {
          questionText: 'Đơn vị đo lực là?',
          options: ['Joule','Watt','Newton','Pascal'],
          correctOption: 2
        }
      ]
    });

    await exam2.save();

    // Exam 3: (đang diễn ra) — title không chứa nhãn, trạng thái = published
    const exam3 = new Exam({
      title: 'Bài kiểm tra Tiếng Anh',
      description: 'Bài kiểm tra mẫu đang diễn ra, chưa có học sinh tham gia',
      creator: teacherUser._id,
      subject: 'Tiếng Anh',
      grade: '11',
      durationMinutes: 45,
      passMark: 5,
      randomizeQuestions: false,
      showAnswersAfterExam: false,
      status: 'Đang diễn ra',
      startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 phút trước
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 giờ tới
      questions: [
        {
          questionText: 'Chọn từ đồng nghĩa với "Happy"',
          options: ['Sad','Joyful','Angry','Tired'],
          correctOption: 1
        },
        {
          questionText: 'What is the past tense of "go"?',
          options: ['goed','went','gone','going'],
          correctOption: 1
        }
      ]
    });

    await exam3.save();

    console.log('-----------------------------------');
    console.log('Hoàn tất quá trình Seed.');
    process.exit();
  } catch (error) {
    console.error('Lỗi seed data:', error);
    process.exit(1);
  }
};

seedData();