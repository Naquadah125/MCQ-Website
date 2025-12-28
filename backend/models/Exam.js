const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: {
      type: [String],
      validate: [v => v.length === 4, 'Phải có đúng 4 đáp án']
    },
    correctOption: { type: Number, required: true, min: 0, max: 3 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);