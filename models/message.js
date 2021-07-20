const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  messageTitle: { type: String, minLength: 1, required: true },
  messageBody: { type: String, minLength: 1, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
