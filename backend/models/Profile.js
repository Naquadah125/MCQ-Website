const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  // Liên kết với User ID
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  fullName: { type: String, required: true },
  phoneNumber: { type: String },
  avatar: { type: String, default: "" }, // Đường dẫn ảnh đại diện
  address: { type: String },

  // Thông tin đặc thù theo vai trò (Dùng chung 1 chỗ để dễ quản lý)
  bio: { type: String },      // Giới thiệu bản thân
  studentId: { type: String }, // Cho Học sinh
  teacherId: { type: String }, // Cho Giáo viên
  major: { type: String },     // Chuyên ngành/Môn học
  class: { type: String },     // Lớp

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);