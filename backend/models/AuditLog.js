const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  time: { type: Date, default: Date.now },
  detail: { type: String }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);