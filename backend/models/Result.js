const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ai làm bài
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },    // Bài thi nào
  answers: [{
    questionId: String,
    selectedOption: Number
  }],
  score: { type: Number, required: true }, // Điểm số
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);