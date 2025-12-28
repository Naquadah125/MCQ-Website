const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  exam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exam', 
    required: true 
  },
  answers: [{
    questionText: String,
    selectedOption: Number,
    correctOption: Number,
    isCorrect: Boolean
  }],
  score: { 
    type: Number, 
    required: true 
  },
  totalQuestions: { 
    type: Number, 
    required: true 
  },
  correctCount: { 
    type: Number, 
    default: 0 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Result', ResultSchema);