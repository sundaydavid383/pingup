const mongoose = require('mongoose');
const { Schema } = mongoose;

/* small sub-schemas */
const sessionSchema = new Schema({
  token: String,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const notificationSettingsSchema = new Schema({
  email: { type: Boolean, default: true },
  push:  { type: Boolean, default: true },
  mentions: { type: Boolean, default: true }
}, { _id: false });

const privacySettingsSchema = new Schema({
  profileVisibility: { type: String, enum: ['public','friends','private'], default: 'public' },
  showEmail: { type: Boolean, default: false },
  showDob: { type: Boolean, default: false }
}, { _id: false });

/* main user schema */
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },

  role: { type: String, enum: ['user','moderator','admin'], default: 'user' },
  provider: { type: String, enum: ['local','google','facebook'], default: 'local' },
  providerId: String,

  profilePicUrl: { type: String, default: '' },
  coverPhotoUrl: { type: String, default: '' },
  bio: { type: String, maxlength: 500, default: '' },
  website: String,
  phoneNumber: String,

  dob: Date,
  gender: String,
  occupation: String,
  location: String, // human-friendly
  locationCoords: {              
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },

  // ✅ Church-related fields
  churchName: { type: String, trim: true },
  churchRole: { 
    type: String, 
    enum: [
      'Member',
      'Choir',
      'Usher',
      'Sunday School Teacher',
      'Pastor',
      'Deacon',
      'Elder',
      'Youth Leader',
      'Prayer Team',
      'Other'
    ], 
    default: 'Member' 
  },

  interests: [String],

  otpCode: { type: String, select: false },
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },

  // Social relations
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  connections: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  mutedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  // Security / account management
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,

  // Sessions / analytics / preferences
  sessions: [sessionSchema],
  notificationSettings: { type: notificationSettingsSchema, default: () => ({}) },
  privacySettings: { type: privacySettingsSchema, default: () => ({}) },

  postsCount: { type: Number, default: 0 },
  profileViews: { type: Number, default: 0 },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },

  status: { type: String, enum: ['active','inactive','banned'], default: 'active' }
}, { timestamps: true });

/* indexes for performance & search */
userSchema.index({ name: 'text', username: 'text', bio: 'text' }); // text search
userSchema.index({ locationCoords: '2dsphere' }); // if using geo queries

module.exports = mongoose.model('User', userSchema);