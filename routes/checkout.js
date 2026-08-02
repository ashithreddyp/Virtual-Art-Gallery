const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/checkout', requireLogin, async (req, res) => {
  const user = await User.findById(req.user._id);
  const { shippingInfo, buyNowItem } = req.body;

  const orderItems = buyNowItem ? [buyNowItem] : user.cart;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).send('Cart is empty');
  }

  user.orders.push({ date: new Date(), items: orderItems, shipping: shippingInfo });
  if (!buyNowItem) user.cart = [];
  await user.save();

  // Clear the buyNowItem from the session after checkout
  req.session.buyNowItem = null;

  res.status(200).send('Checkout successful');
});

module.exports = router;
function requireLogin(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: 'Login required' });
    }
    next();
  }
  