const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Models
const User = require('./models/user');
const Question = require('./models/Question');

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
    console.log('🗑️  Đã xóa dữ liệu cũ');

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
    
    console.log('👤 Đã tạo Users thành công');

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

    await Question.insertMany(questionsWithAuthor);
    console.log('📚 Đã tạo Câu hỏi mẫu thành công');

    console.log('-----------------------------------');
    console.log('🎉 Hoàn tất quá trình Seed!');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi seed data:', error);
    process.exit(1);
  }
};

seedData();