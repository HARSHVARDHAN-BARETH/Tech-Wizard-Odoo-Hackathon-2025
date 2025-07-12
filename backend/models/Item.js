const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String },
  condition: { type: String, enum: ['new', 'like new', 'used', 'worn'], required: true },
  tags: [{ type: String }],
  images: [{ type: String }], // Store image URLs or file paths
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availability: { type: Boolean, default: true }, // Indicates if item is available for swap/redemption
  status: { type: String, enum: ['available', 'pending', 'swapped', 'redeemed'], default: 'available' },
  isApproved: { type: Boolean, default: false }, // For admin moderation
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);