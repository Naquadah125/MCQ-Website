const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  answers: [{
    questionId: String,
    selectedOption: Number
  }],
  score: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);