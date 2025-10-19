const mongoose = require('mongoose');

const RequestLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who sent the request
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  action: { type: String, enum: ['accepted', 'rejected'], required: true },
  byUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who responded
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RequestLog', RequestLogSchema);
