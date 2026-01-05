const express = require('express');
const router = express.Router();
const { createLog, getLogs } = require('../controllers/auditLogController');

// Ghi log hoạt động
router.post('/', createLog);
// Lấy danh sách log
router.get('/', getLogs);

// Debug: trả về tổng số log (dùng để test nhanh)
router.get('/count', async (req, res) => {
  try {
    const AuditLog = require('../models/AuditLog');
    const count = await AuditLog.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy số lượng log', error: err.message });
  }
});

module.exports = router;
