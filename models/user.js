const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// membership status:
// joined (only signed up)
// member: has entered secret passcode and can now access messages

const UserSchema = new mongoose.Schema({
  firstName: { type: String, minLength: 1, required: true },
  familyName: { type: String, minLength: 1, required: true },
  username: { type: String, minLength: 1, required: true },
  password: { type: String, minLength: 1, required: true },
  membership: { type: String, enum: ['joined', 'member'], required: true },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.methods.validPassword = function (password) {
  return bcrypt
    .compare(password, this.password)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(`Failed to validate password with message: ${err.message}`);
    });
};

module.exports = mongoose.model('User', UserSchema);
