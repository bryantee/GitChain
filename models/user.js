const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: { type: String },
  currentGoal: { type: String },
  currentCommitStreakDays: { type: Number },
  commitsToday: { type: Number },
  highStreak: { type: Number },
  lastCommit: { type: Date },
  lastCheck: { type: Date, required: true },
  streakDates: [ Date ]
});

// [
//   { date: value, streak: 1 },
//   { date: value, streak: 2 }
// ]

// TODO: Set instance method for user to check if commit hasn't been made, signaling broken streak

UserSchema.methods.validatePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isValid) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, isValid);
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
