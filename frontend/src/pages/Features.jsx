import React from 'react';
import './Features.css';

function Features() {
  const features = [
    {
      id: 1,
      title: 'Câu hỏi chất lượng cao',
      description: 'Hàng ngàn câu hỏi trắc nghiệm được biên soạn bởi các giáo viên hàng đầu'
    },
    {
      id: 2,
      title: 'Nhiều môn học',
      description: 'Toán, Văn, Anh, Hóa, Lí, Sinh, Địa lí, Lịch sử...'
    },
    {
      id: 3,
      title: 'Đánh giá thực tế',
      description: 'Kết quả trắc nghiệm được tính theo chuẩn của các kỳ thi chính thức'
    },
    {
      id: 4,
      title: 'Giao diện thân thiện',
      description: 'Dễ sử dụng, không cần cài đặt phức tạp'
    },
    {
      id: 5,
      title: 'Thống kê chi tiết',
      description: 'Xem lại các câu sai và cải thiện điểm yếu của mình'
    },
    {
      id: 6,
      title: 'Truy cập mọi lúc',
      description: 'Học tập bất kỳ lúc nào, trên bất kỳ thiết bị nào'
    }
  ];

  return (
    <div className="features-container">
      <section className="features-hero">
        <h1>Tính năng nổi bật</h1>
        <p>Tất cả những gì bạn cần để ôn tập hiệu quả</p>
      </section>

      <section className="features-grid">
        {features.map(feature => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">{feature.id}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Features;
