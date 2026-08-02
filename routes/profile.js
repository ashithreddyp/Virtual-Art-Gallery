// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const CartItem = require('../models/cartitem');
const Order = require('../models/order');

// Middleware to check authentication
function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Please log in' });
  }
  next();
}

// Get user profile data
router.get('/profile', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      username: user.username,
      email: user.email,
      address: user.shippingAddress || 'Not provided'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Get user orders
router.get('/orders', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ orders: user.orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get user cart
router.get('/cart', requireLogin, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user._id }).populate('productId');
    res.json({ cart: cartItems });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart items' });
  }
});

module.exports = router;
