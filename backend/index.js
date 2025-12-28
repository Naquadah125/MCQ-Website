require('dotenv').config(); // ĐƯA DÒNG NÀY LÊN ĐẦU TIÊN
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Đường dẫn này đã đúng sau khi bạn sửa tên folder

const app = express();

// Kết nối DB
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server và Database đã sẵn sàng!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port: ${PORT}`);
});