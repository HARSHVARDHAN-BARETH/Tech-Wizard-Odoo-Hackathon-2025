const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  profile: {
    fullName: { type: String },
    address: { type: String },
    phone: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);