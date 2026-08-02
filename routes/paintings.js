const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Painting = require('../models/painting.js');

// Configure multer storage to save files in /public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET all paintings
router.get('/', async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json(paintings);
  } catch (err) {
    console.error('Error fetching paintings:', err);
    res.status(500).json({ error: 'Failed to fetch paintings' });
  }
});

// POST: Upload a new painting
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const newPainting = new Painting({
      title,
      price,
      description,
      image: '/images/' + req.file.filename
    });
    await newPainting.save();
    res.status(201).json(newPainting);
  } catch (err) {
    console.error('Error uploading painting:', err);
    res.status(500).json({ error: 'Failed to upload painting' });
  }
});

// DELETE: Remove painting by ID
router.delete('/:id', async (req, res) => {
  try {
    await Painting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting painting:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
