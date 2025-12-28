const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  },
  content: { type: String, required: true },
  options: [
    { 
      key: { type: String, required: true },
      text: { type: String, required: true }
    }
  ],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);