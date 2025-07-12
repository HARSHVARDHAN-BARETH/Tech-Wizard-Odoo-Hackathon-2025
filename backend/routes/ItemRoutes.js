const express = require('express');
const cloudinary = require('cloudinary').v2;
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Item (with Cloudinary image upload)
router.post('/items', authMiddleware, async (req, res) => {
  const { title, description, category, type, size, condition, tags, images } = req.body;
  if (!title || !description || !category || !type || !condition) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const imageUrls = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'swap_platform',
        });
        imageUrls.push(result.secure_url);
      }
    }
    const item = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      images: imageUrls,
      uploader: req.user.id,
      isApproved: false,
    });
    await item.save();
    res.status(201).json({ message: 'Item created, awaiting approval', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Approved Items (for carousel, browse)
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find({ isApproved: true, availability: true })
      .populate('uploader', 'username profile');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Item by ID (for item detail page)
router.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('uploader', 'username profile');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Item
router.put('/items/:id', authMiddleware, async (req, res) => {
  const { title, description, category, type, size, condition, tags, images } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const imageUrls = item.images;
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'swap_platform',
        });
        imageUrls.push(result.secure_url);
      }
    }
    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.type = type || item.type;
    item.size = size || item.size;
    item.condition = condition || item.condition;
    item.tags = tags || item.tags;
    item.images = imageUrls;
    item.isApproved = false;
    await item.save();
    res.json({ message: 'Item updated, awaiting approval', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Item
router.delete('/items/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;