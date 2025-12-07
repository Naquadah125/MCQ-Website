import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Chào mừng đến QuizMaster</h1>
          <p>Nền tảng học tập trực tuyến cho học sinh lớp 12</p>
          <button className="cta-button">Bắt đầu làm bài</button>
        </div>
      </section>

      <section className="intro-section">
        <h2>Giới thiệu về chúng tôi</h2>
        <p>
          QuizMaster là một nền tảng học tập trực tuyến hiện đại, được thiết kế đặc biệt 
          cho học sinh lớp 12. Chúng tôi cung cấp hàng ngàn câu hỏi trắc nghiệm chất lượng cao 
          từ các môn học chính, giúp học sinh ôn luyện hiệu quả cho các kỳ thi quan trọng.
        </p>
      </section>
    </div>
  );
}

export default Home;
