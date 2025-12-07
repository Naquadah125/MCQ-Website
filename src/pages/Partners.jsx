import React from 'react';
import './Partners.css';

function Partners() {
  const partners = [
    { id: 1, name: 'Đại học Quốc gia Hà Nội', logo: '🏫' },
    { id: 2, name: 'Bộ Giáo dục và Đào tạo', logo: '📚' },
    { id: 3, name: 'Hiệp hội Giáo dục Việt Nam', logo: '🎓' },
    { id: 4, name: 'Trung tâm Dạy kèm VinaEdu', logo: '👨‍🏫' }
  ];

  return (
    <div className="partners-container">
      <section className="partners-hero">
        <h1>Đối tác của chúng tôi</h1>
        <p>Chúng tôi hợp tác với các tổ chức giáo dục hàng đầu</p>
      </section>

      <section className="partners-grid">
        {partners.map(partner => (
          <div key={partner.id} className="partner-card">
            <div className="partner-logo">{partner.logo}</div>
            <h3>{partner.name}</h3>
          </div>
        ))}
      </section>

      <section className="partnership-info">
        <h2>Tại sao chọn QuizMaster?</h2>
        <ul>
          <li>✓ Được tin tưởng bởi hàng trăm ngàn học sinh</li>
          <li>✓ Nội dung được kiểm duyệt bởi các chuyên gia</li>
          <li>✓ Cập nhật thường xuyên theo chương trình giáo dục</li>
          <li>✓ Hỗ trợ khách hàng 24/7</li>
        </ul>
      </section>
    </div>
  );
}

export default Partners;
