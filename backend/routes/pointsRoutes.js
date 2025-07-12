const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const PointsTransaction = require('../models/PointsTransaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Redeem Item with Points
router.post('/points/redeem', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ message: 'Item ID required' });
  }
  try {
    const item = await Item.findById(itemId);
    if (!item || !item.availability || !item.isApproved) {
      return res.status(400).json({ message: 'Item not available or not approved' });
    }
    const user = await User.findById(req.user.id);
    const pointsCost = 50;
    if (user.points < pointsCost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    user.points -= pointsCost;
    item.status = 'redeemed';
    item.availability = false;
    await new PointsTransaction({
      user: req.user.id,
      item: itemId,
      points: -pointsCost,
      type: 'spent',
      description: `Redeemed item: ${item.title}`,
    }).save();
    await user.save();
    await item.save();
    res.json({ message: 'Item redeemed', points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Points Transaction History
router.get('/points/history', authMiddleware, async (req, res) => {
  try {
    const transactions = await PointsTransaction.find({ user: req.user.id })
      .populate('item', 'title');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;