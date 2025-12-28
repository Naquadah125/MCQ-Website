const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Định nghĩa lại Schema user đơn giản để seed
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' }
});

const User = mongoose.model('User', userSchema);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa dữ liệu cũ để tránh trùng lặp
    await User.deleteMany({});
    console.log('🗑️  Đã xóa user cũ');

    // Mã hóa mật khẩu "123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    // Tạo user mẫu
    const users = [
      {
        name: 'Thầy Giáo Test',
        email: 'teacher@test.com',
        password: hashedPassword,
        role: 'teacher'
      },
      {
        name: 'Học Sinh Test',
        email: 'student@test.com',
        password: hashedPassword,
        role: 'student'
      }
    ];

    await User.insertMany(users);
    console.log('🎉 Đã tạo tài khoản mẫu thành công!');
    console.log('-----------------------------------');
    console.log('Giáo viên: teacher@test.com  | Pass: 123');
    console.log('Học sinh:  student@test.com  | Pass: 123');
    console.log('-----------------------------------');

    process.exit();
  } catch (error) {
    console.error('Lỗi seed data:', error);
    process.exit(1);
  }
};

seedData();