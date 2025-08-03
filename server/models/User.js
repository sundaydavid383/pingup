const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, min: 13, max: 120 },
  gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'] },
  occupation: { type: String, trim: true },
  location: { type: String, trim: true },
  churchName: { type: String, trim: true },
  churchRole: { type: String, trim: true },
  interests: { type: String, trim: true },
  bio: { type: String, trim: true },
  prayerRequest: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);