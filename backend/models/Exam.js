const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tên kỳ thi
  description: { type: String },           // Mô tả
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Giáo viên/Admin tạo
  startTime: { type: Date, required: true }, // Thời gian bắt đầu
  endTime: { type: Date, required: true },   // Thời gian kết thúc
  questions: [{
    questionText: { type: String, required: true },
    options: {
      type: [String],
      validate: [v => v.length === 4, 'Phải có đúng 4 đáp án'] // Kiểm tra 4 đáp án
    },
    correctOption: { type: Number, required: true, min: 0, max: 3 } // Vị trí đáp án đúng (0-3)
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);