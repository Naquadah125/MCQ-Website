const AuditLog = require('../models/AuditLog');

// Ghi log hoạt động
exports.createLog = async (req, res) => {
  try {
    const { user, action, detail } = req.body;
    const log = new AuditLog({
      user,
      action,
      detail,
      time: new Date()
    });
    await log.save();
    console.log('[AuditLog] created:', { user: log.user, action: log.action, time: log.time });
    res.status(201).json({ message: 'Log created' });
  } catch (err) {
    console.error('[AuditLog] create error:', err);
    res.status(500).json({ message: 'Lỗi ghi log', error: err.message });
  }
};

// Lấy danh sách log
exports.getLogs = async (req, res) => {
  try {
    const { search = '', action = '' } = req.query;
    const query = {};
    if (search) query.user = { $regex: search, $options: 'i' };
    if (action) query.action = action;
    const logs = await AuditLog.find(query).sort({ time: -1 }).limit(200);
    console.log('[AuditLog] getLogs', { search, action, returned: logs.length });
    res.json(logs);
  } catch (err) {
    console.error('[AuditLog] getLogs error', err);
    res.status(500).json({ message: 'Lỗi lấy log', error: err.message });
  }
};
