const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, // Optional: for point redemption
  points: { type: Number, required: true }, // Positive for earning, negative for spending
  type: { type: String, enum: ['earned', 'spent'], required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PointsTransaction', pointsTransactionSchema);