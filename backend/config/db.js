const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Không tìm thấy MONGODB_URI trong file .env");
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB đã kết nối thành công!");
  } catch (error) {
    console.log("❌ Lỗi kết nối:", error.message);
  }
};

module.exports = connectDB;