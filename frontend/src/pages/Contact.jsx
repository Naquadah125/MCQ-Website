import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi form
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <h1>Liên hệ với chúng tôi</h1>
        <p>Chúng tôi rất vui nhận được phản hồi từ bạn</p>
      </section>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Thông tin liên hệ</h2>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <h3>Địa chỉ</h3>
              <p>123 Đường Lê Lợi, Quận 1, TP.HCM</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <h3>Điện thoại</h3>
              <p>+84 (0) 123 456 789</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <div>
              <h3>Email</h3>
              <p>info@quizmaster.vn</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <div>
              <h3>Giờ làm việc</h3>
              <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Gửi thông điệp cho chúng tôi</h2>
          
          <div className="form-group">
            <label htmlFor="name">Tên của bạn</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Chủ đề</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Nhập chủ đề"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Thông điệp</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Nhập thông điệp của bạn"
              rows="6"
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Gửi thông điệp
          </button>

          {submitted && (
            <div className="success-message">
              ✓ Cảm ơn! Chúng tôi sẽ phản hồi bạn sớm nhất có thể.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;
