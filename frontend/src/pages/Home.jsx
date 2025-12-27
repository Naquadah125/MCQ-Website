import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Chào mừng đến Quizzing</h1>
          <p>Nền tảng học tập trực tuyến cho học sinh trung cấp</p>
          <button className="cta-button">Bắt đầu làm bài</button>
        </div>
      </section>

      <section className="intro-section">
        <h2>Giới thiệu về chúng tôi</h2>
        <p>
          Quizzing là một nền tảng học tập trực tuyến hiện đại, được thiết kế đặc biệt 
          cho học sinh Trung học phổ thông. Chúng tôi cung cấp hàng ngàn câu hỏi trắc nghiệm chất lượng cao từ các
          môn học chính, giúp tạo các bài thi trắc nghiệm đồng thòi giúp học sinh ôn luyện hiệu quả cho các kỳ thi.
        </p>
      </section>
    </div>
  );
}

export default Home;
