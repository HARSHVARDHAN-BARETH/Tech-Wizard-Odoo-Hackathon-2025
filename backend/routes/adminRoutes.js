const express = require('express');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Get Items for Moderation
router.get('/admin/items', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ isApproved: false })
      .populate('uploader', 'username');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve Item
router.put('/admin/items/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    item.isApproved = true;
    await item.save();
    res.json({ message: 'Item approved', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject/Remove Item
router.delete('/admin/items/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;