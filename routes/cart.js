const express = require('express');
const router = express.Router();
const CartItem = require('../models/cartitem');
const Product = require('../models/painting'); // Assuming you have a Product model for paintings

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'You need to be logged in to perform this action' });
  }
  next();
};

// Add item to cart (requires authentication)
router.post('/cart', isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const existingCartItem = await CartItem.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      const newCartItem = new CartItem({ userId, productId, quantity });
      await newCartItem.save();
    }
    res.status(200).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// Remove item from cart (requires authentication)
router.delete('/cart/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    await CartItem.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

// Get cart items for user (requires authentication)
router.get('/cart', isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  try {
    const cartItems = await CartItem.find({ userId }).populate('productId');
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve cart items' });
  }
});

module.exports = router;
