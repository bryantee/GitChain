const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  avatar: { type: String },
  currentGoal: { type: String },
  currentCommitStreakDays: { type: Number },
  commitsToday: { type: Number },
  highStreak: { type: Number },
  lastCommit: { type: Date }
});

// TODO: Set instance method for user to check if commit hasn't been made, signaling broken streak

const User = mongoose.model('User', UserSchema);

module.exports = User;
