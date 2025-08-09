const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: String,
  gender: String,
  occupation: String,
  location: String,
  churchName: String,
  churchRole: String,
  interests: String,
  bio: String,
  prayerRequest: String,
  profilePicUrl: String,
  otpCode: String,
otpExpires: Date,
isVerified: {
  type: Boolean,
  default: false,
},

  // 🔵 NEW Optional Fields
  currentCity: { type: String, default: null },
  workplace: { type: String, default: null },
  school: { type: String, default: null },
  homeTown: { type: String, default: null },
  relationshipStatus: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);