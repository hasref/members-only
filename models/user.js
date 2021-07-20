const mongoose = require('mongoose');

// membership status:
// joined (only signed up)
// member: has entered secret passcode and can now access messages

const UserSchema = new mongoose.Schema({
  firstName: { type: String, minLength: 1, required: true },
  familyName: { type: String, minLength: 1, required: true },
  username: { type: String, minLength: 1, required: true },
  password: { type: String, required: true },
  membership: { type: String, enum: ['joined', 'member'], required: true },
});

module.exports = mongoose.model('User', UserSchema);
