const express = require('express');
const Item = require('../models/Item');
const Swap = require('../models/Swap');
const User = require('../models/User');
const PointsTransaction = require('../models/PointsTransaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Swap Request
router.post('/swaps', authMiddleware, async (req, res) => {
  const { itemRequested, itemOffered } = req.body;
  if (!itemRequested) {
    return res.status(400).json({ message: 'Item requested is required' });
  }
  try {
    const item = await Item.findById(itemRequested);
    if (!item || !item.availability || !item.isApproved) {
      return res.status(400).json({ message: 'Item not available or not approved' });
    }
    if (itemOffered) {
      const offeredItem = await Item.findById(itemOffered);
      if (!offeredItem || offeredItem.uploader.toString() !== req.user.id) {
        return res.status(400).json({ message: 'Invalid offered item' });
      }
    }
    const swap = new Swap({
      requester: req.user.id,
      itemRequested,
      itemOffered,
    });
    await swap.save();
    item.status = 'pending';
    item.availability = false;
    await item.save();
    res.status(201).json({ message: 'Swap request created', swap });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User's Swaps (ongoing and completed)
router.get('/swaps', authMiddleware, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { 'itemRequested.uploader': req.user.id }],
    })
      .populate('requester', 'username')
      .populate('itemRequested', 'title images')
      .populate('itemOffered', 'title images');
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Swap Status (accept/reject/complete)
router.put('/swaps/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const swap = await Swap.findById(req.params.id).populate('itemRequested');
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    const item = await Item.findById(swap.itemRequested);
    if (item.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    swap.status = status;
    if (status === 'rejected') {
      item.status = 'available';
      item.availability = true;
    } else if (status === 'completed') {
      item.status = 'swapped';
      item.availability = false;
      const points = 10;
      await User.findByIdAndUpdate(swap.requester, { $inc: { points } });
      await User.findByIdAndUpdate(item.uploader, { $inc: { points } });
      await new PointsTransaction({
        user: swap.requester,
        points,
        type: 'earned',
        description: 'Swap completed',
      }).save();
      await new PointsTransaction({
        user: item.uploader,
        points,
        type: 'earned',
        description: 'Swap completed',
      }).save();
    }
    await swap.save();
    await item.save();
    res.json({ message: `Swap ${status}`, swap });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;