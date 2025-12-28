const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin'], 
    default: 'student' 
  }
});

// --- PHẦN SỬA LỖI TẠI ĐÂY ---
UserSchema.pre('save', async function() {
  // Nếu mật khẩu không bị thay đổi thì bỏ qua
  if (!this.isModified('password')) return;

  try {
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Mongoose sẽ tự bắt lỗi này và dừng việc save
  }
});

module.exports = mongoose.model('User', UserSchema);