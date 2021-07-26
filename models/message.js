const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const MessageSchema = new mongoose.Schema({
  messageTitle: { type: String, minLength: 1, required: true },
  messageBody: { type: String, minLength: 1, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

MessageSchema.virtual('url').get(function () {
  return '/message/' + this._id;
});

MessageSchema.virtual('humanTime').get(function () {
  const now = DateTime.fromJSDate(new Date());
  const messageTime = DateTime.fromJSDate(this.timestamp);
  const diff = now.diff(messageTime);

  const [days, hours, minutes] = [
    diff.toFormat('dd'),
    diff.toFormat('hh'),
    diff.toFormat('mm'),
  ].map((val) => parseInt(val));

  if (days === 0) {
    if (minutes <= 1) {
      return '1 minute ago';
    } else if (minutes > 1 && minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours <= 1) {
      return '1 hour ago';
    } else if (hours > 1 && hours < 24) {
      return `${hours} hours ago`;
    }
  }
  return messageTime.toLocaleString();
});

module.exports = mongoose.model('Message', MessageSchema);
