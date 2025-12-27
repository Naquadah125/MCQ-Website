# QuizMaster - MCQ Website for High School Students

A modern web application for high school students (Grade 12) to practice multiple-choice questions (MCQ) across various subjects.

## 📋 Project Overview

QuizMaster is a comprehensive quiz platform designed to help high school students prepare effectively through structured practice questions. The platform includes a responsive frontend and a robust backend system.

**Tech Stack:**
- **Frontend:** React + Vite
- **Backend:** Python Flask
- **Database:** MongoDB

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB
- Git

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
```bash
cd quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/`

### Backend Setup (Flask + MongoDB)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file with your configuration:
```bash
FLASK_APP=app.py
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/quizmaster
SECRET_KEY=your_secret_key_here
```

6. Run the Flask development server:
```bash
flask run
```

The backend API will be available at `http://localhost:5000/`

## 📁 Project Structure

```
FINAL/
├── quiz-app/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Partners.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Backend (Flask + MongoDB)
│   ├── models/               # Database models
│   │   ├── user.py
│   │   └── quiz.py
│   ├── routes/               # API routes
│   ├── config.py             # Configuration
│   ├── app.py                # Flask application
│   ├── requirements.txt       # Python dependencies
│   └── .env                  # Environment variables
│
└── README.md                 # This file
```

## 🎨 Frontend Features

- **Responsive Navbar:** Navigation menu with login/signup buttons
- **Home Page:** Hero section with call-to-action
- **Quiz Page:** Interactive multiple-choice question interface
  - Real-time feedback on answers
  - Progress tracking
  - Score calculation
  - Results summary
- **Feature Page:** Showcase of platform capabilities
- **Partners Page:** Display of institutional partners
- **Contact Page:** Contact form for user inquiries

## 🔧 Backend Features

- **User Authentication:** Login and registration system
- **Quiz Management:** Create and manage quiz questions
- **Database:** MongoDB for storing users, quizzes, and results
- **API Endpoints:** RESTful API for frontend integration

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `flask run` - Start Flask development server
- `python -m pytest` - Run tests

## 📚 Technologies Used

### Frontend
- React (UI library)
- Vite (Build tool)
- React Router (Navigation)

### Backend
- Flask (Web framework)
- Flask-PyMongo (MongoDB integration)
- Flask-JWT-Extended (Authentication)
- Python-dotenv (Environment variables)

### Database
- MongoDB (NoSQL database)

## 🎯 TODO List - Features to Implement

### High Priority
- [ ] **A. User Authentication System**
  - Implement JWT-based login/logout
  - Add user registration with email validation
  - Password reset functionality

- [ ] **B. Quiz Question Management**
  - Create API endpoints for CRUD operations on questions
  - Implement subject categorization
  - Add difficulty levels to questions

- [ ] **C. Results and Analytics**
  - Store quiz results in MongoDB
  - Calculate user statistics (average score, weak subjects)
  - Generate performance reports

### Medium Priority
- [ ] **D. User Profile Management**
  - User dashboard showing quiz history
  - Profile information editing
  - Score tracking and improvements

- [ ] **E. Search and Filter**
  - Search questions by subject
  - Filter by difficulty level
  - Sort by topics

- [ ] **F. Admin Panel**
  - Dashboard for managing users
  - Question creation and editing interface
  - Analytics and reporting

### Low Priority
- [ ] **G. Social Features**
  - Leaderboard system
  - Share quiz results
  - Comment on questions

- [ ] **H. Mobile Optimization**
  - Improve mobile UI/UX
  - Add PWA functionality
  - Offline quiz mode

## 🔌 API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `GET /api/questions/subject/:subject` - Get questions by subject

### Results
- `POST /api/results` - Submit quiz result
- `GET /api/results/:userId` - Get user results

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For any questions or issues, please contact us through the Contact page or reach out to our team.

## 👥 Team

- Frontend Development: React + Vite
- Backend Development: Flask + MongoDB
