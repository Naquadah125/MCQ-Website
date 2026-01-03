const users = [
  {
    name: 'Thầy Giáo Test',
    email: 'teacher@test.com',
    role: 'teacher'
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin'
  },
  {
    name: 'Học Sinh A',
    email: 'studentA@test.com',
    role: 'student'
  },
  {
    name: 'Học Sinh B',
    email: 'studentB@test.com',
    role: 'student'
  }
];

const questions = [
  {
    subject: 'Toán',
    grade: '12',
    difficulty: 'easy',
    content: 'Đạo hàm của hàm số y = x^2 là gì?',
    options: [
      { key: 'A', text: '2x' }, { key: 'B', text: 'x' },
      { key: 'C', text: '2' },  { key: 'D', text: 'x^3/3' }
    ],
    correctAnswer: 'A',
    explanation: 'Sử dụng công thức đạo hàm cơ bản (x^n)\' = n*x^(n-1).'
  },
  {
    subject: 'Toán',
    grade: '12',
    difficulty: 'medium',
    content: 'Nguyên hàm của cos(x) là:',
    options: [
      { key: 'A', text: '-sin(x) + C' },
      { key: 'B', text: 'sin(x) + C' },
      { key: 'C', text: 'cos(x) + C' },
      { key: 'D', text: '-cos(x) + C' }
    ],
    correctAnswer: 'B',
    explanation: 'Đạo hàm của sin(x) là cos(x), nên nguyên hàm của cos(x) là sin(x).'
  },
  {
    subject: 'Vật Lý',
    grade: '10',
    difficulty: 'easy',
    content: 'Đơn vị đo của lực là gì?',
    options: [
      { key: 'A', text: 'Joule (J)' },
      { key: 'B', text: 'Watt (W)' },
      { key: 'C', text: 'Newton (N)' },
      { key: 'D', text: 'Pascal (Pa)' }
    ],
    correctAnswer: 'C',
    explanation: 'Newton (N) là đơn vị chuẩn SI dùng để đo lực.'
  },
  {
    subject: 'Tiếng Anh',
    grade: '11',
    difficulty: 'medium',
    content: 'Chọn từ đồng nghĩa với "Happy":',
    options: [
      { key: 'A', text: 'Sad' },
      { key: 'B', text: 'Joyful' },
      { key: 'C', text: 'Angry' },
      { key: 'D', text: 'Tired' }
    ],
    correctAnswer: 'B',
    explanation: 'Joyful có nghĩa là vui sướng, hân hoan, đồng nghĩa với Happy.'
  }
];

module.exports = { users, questions };