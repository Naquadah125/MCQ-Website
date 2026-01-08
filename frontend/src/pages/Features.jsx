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
          <div className="icon-wrapper icon-blue"></div>
          <h2>Tạo bài thi trong nháy mắt</h2>
          <p>
            Không cần tốn hàng giờ soạn đề. Với kho ngân hàng câu hỏi khổng lồ và công cụ 
            soạn thảo thông minh, bạn có thể tạo bài kiểm tra trắc nghiệm chỉ trong vài phút.
          </p>
          <ul className="feature-list">
            <li>Hỗ trợ nhập từ File Excel</li>
            <li>Trộn câu hỏi tự động</li>
          </ul>
        </div>
        <div className="feature-image">
          <img src="https://img.freepik.com/free-vector/online-test-concept-illustration_114360-5219.jpg" alt="Tạo bài thi" />
        </div>
      </section>

      <section className="feature-block reverse">
        <div className="feature-text">
          <div className="icon-wrapper icon-green"></div>
          <h2>Báo cáo kết quả chi tiết</h2>
          <p>
            Hiểu rõ năng lực học sinh qua từng con số. Hệ thống tự động chấm điểm và 
            phân tích kết quả ngay sau khi nộp bài.
          </p>
          <ul className="feature-list">
            <li>Phổ điểm chi tiết từng câu</li>
            <li>Lưu trữ lịch sử làm bài</li>
            <li>Xuất báo cáo ra file Excel</li>
          </ul>
        </div>
        <div className="feature-image">
          <img src="https://img.freepik.com/free-vector/setup-analytics-concept-illustration_114360-1859.jpg" alt="Báo cáo kết quả" />
        </div>
      </section>
    </div>
  );
}

export default Features;