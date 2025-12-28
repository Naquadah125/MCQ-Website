import React from 'react';
import './Features.css';

function Features() {
  return (
    <div className="features-container">
      {/* 1. Header Section */}
      <section className="features-header">
        <span className="brand-tag">Khám phá sức mạnh của Quizzing</span>
        <h1>Mọi công cụ bạn cần để <br /> dạy và học hiệu quả</h1>
        <p>Từ việc tạo bài kiểm tra nhanh đến phân tích kết quả chi tiết, Quizzing giúp đơn giản hóa mọi quy trình.</p>
      </section>

      {/* 2. Zig-zag Sections */}
      <section className="feature-block">
        <div className="feature-text">
          <div className="icon-wrapper icon-blue">📝</div>
          <h2>Tạo bài thi trong nháy mắt</h2>
          <p>
            Không cần tốn hàng giờ soạn đề. Với kho ngân hàng câu hỏi khổng lồ và công cụ 
            soạn thảo thông minh, bạn có thể tạo bài kiểm tra trắc nghiệm chỉ trong vài phút.
          </p>
          <ul className="feature-list">
            <li>Hỗ trợ nhập từ File Word/Excel</li>
            <li>Trộn câu hỏi tự động</li>
            <li>Chèn hình ảnh, công thức toán học dễ dàng</li>
          </ul>
        </div>
        <div className="feature-image">
          <img src="https://img.freepik.com/free-vector/online-test-concept-illustration_114360-5219.jpg" alt="Tạo bài thi" />
        </div>
      </section>

      <section className="feature-block reverse">
        <div className="feature-text">
          <div className="icon-wrapper icon-purple">⚡</div>
          <h2>Tổ chức thi đấu trực tiếp</h2>
          <p>
            Biến giờ kiểm tra căng thẳng thành trò chơi thú vị. Chế độ Live Quiz cho phép 
            cả lớp cùng thi đấu, xem bảng xếp hạng thời gian thực và đua top.
          </p>
          <ul className="feature-list">
            <li>Bảng xếp hạng thời gian thực</li>
            <li>Âm nhạc và hiệu ứng sống động</li>
            <li>Chế độ thi theo nhóm hoặc cá nhân</li>
          </ul>
        </div>
        <div className="feature-image">
          <img src="https://img.freepik.com/free-vector/gamification-concept-illustration_114360-26462.jpg" alt="Thi đấu trực tiếp" />
        </div>
      </section>

      <section className="feature-block">
        <div className="feature-text">
          <div className="icon-wrapper icon-green">📊</div>
          <h2>Báo cáo kết quả chi tiết</h2>
          <p>
            Hiểu rõ năng lực học sinh qua từng con số. Hệ thống tự động chấm điểm và 
            phân tích kết quả ngay sau khi nộp bài.
          </p>
          <ul className="feature-list">
            <li>Phổ điểm chi tiết từng câu</li>
            <li>Lưu trữ lịch sử làm bài</li>
            <li>Xuất báo cáo ra file Excel/PDF</li>
          </ul>
        </div>
        <div className="feature-image">
          <img src="https://img.freepik.com/free-vector/setup-analytics-concept-illustration_114360-1859.jpg" alt="Báo cáo kết quả" />
        </div>
      </section>

      {/* 3. Grid Features */}
      <section className="features-grid-section">
        <h2>Tính năng mở rộng</h2>
        <div className="features-grid">
          <div className="grid-item">
            <h3>📱 Đa nền tảng</h3>
            <p>Hoạt động mượt mà trên điện thoại, máy tính bảng và laptop.</p>
          </div>
          <div className="grid-item">
            <h3>🔒 Bảo mật cao</h3>
            <p>Chống gian lận với tính năng xáo trộn và giám sát tab trình duyệt.</p>
          </div>
          <div className="grid-item">
            <h3>📂 Quản lý lớp học</h3>
            <p>Dễ dàng chia nhóm, giao bài tập về nhà và theo dõi tiến độ.</p>
          </div>
        </div>
      </section>

      {/* 4. CTA Footer */}
      <section className="features-cta">
        <h2>Sẵn sàng trải nghiệm phương pháp học tập mới?</h2>
        <button className="cta-button">Đăng ký miễn phí ngay</button>
      </section>
    </div>
  );
}

export default Features;