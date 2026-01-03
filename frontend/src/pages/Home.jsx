import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-wrapper">
        <div className="hero-text">
          <span className="brand-tag">Quizzing Platform</span>
          <h1>Một cách hiệu quả để <br /> ôn luyện trắc nghiệm</h1>
          <p>
            Nền tảng học tập trực tuyến hiện đại dành cho học sinh. 
            Cung cấp kho tàng câu hỏi đa dạng, giúp bạn làm chủ kiến thức và đạt điểm cao trong các kỳ thi.
          </p>
          
          <Link to="/student" className="cta-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Tham gia ngay
          </Link>

          <div className="feature-tags">
            <div className="tag-row">
              <span className="tag">☁️ Cung cấp tài nguyên học sinh</span>
            </div>
            <div className="tag-row">
              <span className="tag">Khai thác học liệu</span>
              <span className="tag">Giao bài tập</span>
              <span className="tag">Thi trực tuyến</span>
            </div>
            <div className="tag-row">
              <span className="tag">Lớp học trực tuyến</span>
              <span className="tag">Tp Tạo nhiệm vụ học tập</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-bg-circle"></div>
          <img 
            src="https://img.freepik.com/free-photo/young-student-woman-wearing-denim-jacket-eyeglasses-holding-colorful-folders-showing-thumb-up-blue-wall_141793-46714.jpg?w=996" 
            alt="Student Learning" 
            className="main-img"
          />
          
          <div className="floating-icon icon-1"></div>
          <div className="floating-icon icon-2"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;