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
    console.log('-----------------------------------');
    console.log('Hoàn tất quá trình Seed.');
    process.exit();
  } catch (error) {
    console.error('Lỗi seed data:', error);
    process.exit(1);
  }
};

seedData();