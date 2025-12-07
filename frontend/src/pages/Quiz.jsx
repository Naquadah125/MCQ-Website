import React, { useState } from 'react';
import './Quiz.css';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Dữ liệu câu hỏi trắc nghiệm cho lớp 12
  const questions = [
    {
      id: 1,
      question: 'Nước nào là quốc gia có số dân nhiều nhất thế giới?',
      options: ['Ấn Độ', 'Trung Quốc', 'Mỹ', 'Indonesia'],
      correct: 0,
      subject: 'Địa lí'
    },
    {
      id: 2,
      question: 'Phương trình nào sau đây là phương trình bậc hai?',
      options: ['x + 2 = 0', 'x² + 2x + 1 = 0', 'x³ - 1 = 0', '2x = 4'],
      correct: 1,
      subject: 'Toán'
    },
    {
      id: 3,
      question: 'Nguyên tố nào có ký hiệu O?',
      options: ['Vàng', 'Oxi', 'Osmium', 'Occium'],
      correct: 1,
      subject: 'Hóa học'
    },
    {
      id: 4,
      question: 'Ai là tác giả của "Truyện Kiều"?',
      options: ['Nguyễn Du', 'Nguyễn Ánh', 'Trần Tế Xương', 'Hồ Xuân Hương'],
      correct: 0,
      subject: 'Văn học'
    },
    {
      id: 5,
      question: 'Chiến tranh Thế giới thứ 2 kết thúc vào năm nào?',
      options: ['1943', '1944', '1945', '1946'],
      correct: 2,
      subject: 'Lịch sử'
    },
    {
      id: 6,
      question: 'Tính giá trị của sin(90°)',
      options: ['0', '1', 'undefined', '-1'],
      correct: 1,
      subject: 'Toán'
    },
    {
      id: 7,
      question: 'Thủ đô của Nhật Bản là gì?',
      options: ['Osaka', 'Tokyo', 'Kyoto', 'Nagoya'],
      correct: 1,
      subject: 'Địa lí'
    },
    {
      id: 8,
      question: 'Axit nào là axit mạnh?',
      options: ['Axit acetic', 'Axit sulfuric', 'Axit citric', 'Axit carbonic'],
      correct: 1,
      subject: 'Hóa học'
    },
    {
      id: 9,
      question: 'Quá trình quang hợp xảy ra ở đâu trong tế bào thực vật?',
      options: ['Tế bào nhân', 'Lục lạp', 'Hạt nhân', 'Ty thể'],
      correct: 1,
      subject: 'Sinh học'
    },
    {
      id: 10,
      question: 'Người sáng chế ra bóng đèn điện là ai?',
      options: ['Nikola Tesla', 'Thomas Edison', 'Albert Einstein', 'Marie Curie'],
      correct: 1,
      subject: 'Vật lí'
    }
  ];

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="quiz-container">
        <div className="result-section">
          <h1>Kết quả bài làm</h1>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-total">/{questions.length}</span>
            </div>
          </div>
          <p className="score-percentage">
            Bạn đạt: {Math.round((score / questions.length) * 100)}%
          </p>
          <div className="result-message">
            {score >= questions.length * 0.8 && (
              <p>🎉 Xuất sắc! Bạn đã làm rất tốt!</p>
            )}
            {score >= questions.length * 0.6 && score < questions.length * 0.8 && (
              <p>😊 Tốt! Còn cần cải thiện thêm một chút nữa.</p>
            )}
            {score < questions.length * 0.6 && (
              <p>📚 Hãy cố gắng ôn tập thêm và thử lại!</p>
            )}
          </div>
          <button className="restart-button" onClick={handleRestartQuiz}>
            Làm lại bài
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="question-count">
            Câu {currentQuestion + 1}/{questions.length}
          </p>
          <p className="subject-tag">{currentQ.subject}</p>
        </div>

        <div className="quiz-body">
          <h2>{currentQ.question}</h2>

          <div className="options-grid">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedAnswer === index
                    ? index === currentQ.correct
                      ? 'correct'
                      : 'incorrect'
                    : showResult && index === currentQ.correct
                    ? 'correct'
                    : ''
                } ${showResult ? 'disabled' : ''}`}
                onClick={() => !showResult && handleAnswerClick(index)}
                disabled={showResult}
              >
                <span className="option-label">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="option-text">{option}</span>
                {showResult && index === currentQ.correct && (
                  <span className="checkmark">✓</span>
                )}
                {showResult && selectedAnswer === index && index !== currentQ.correct && (
                  <span className="cross">✗</span>
                )}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="feedback">
              {selectedAnswer === currentQ.correct ? (
                <p className="correct-feedback">✓ Chính xác!</p>
              ) : (
                <p className="incorrect-feedback">✗ Sai rồi! Đáp án đúng là: <strong>{currentQ.options[currentQ.correct]}</strong></p>
              )}
            </div>
          )}
        </div>

        <div className="quiz-footer">
          {showResult && (
            <button className="next-button" onClick={handleNextQuestion}>
              {currentQuestion + 1 === questions.length ? 'Hoàn thành' : 'Câu tiếp theo'}
            </button>
          )}
        </div>
      </div>

      <div className="quiz-sidebar">
        <div className="score-card">
          <h3>Điểm hiện tại</h3>
          <p className="current-score">{score}/{questions.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
