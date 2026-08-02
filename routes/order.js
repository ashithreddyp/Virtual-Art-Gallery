const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/user');

// Middleware to check if the user is authenticated
function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Please log in' });
  }
  next();
}

// Place an order (checkout route)
router.post('/checkout', requireLogin, async (req, res) => {
  try {
    const { shippingInfo, items } = req.body;

    // Create a new order with the logged-in user's ID
    const newOrder = new Order({
      userId: req.user._id,  // Assign user ID to the order
      shippingInfo,
      items,
      status: 'pending',  // Set initial status of the order
      createdAt: new Date(),
    });

    // Save the order to the database
    await newOrder.save();

    // Associate the order with the logged-in user (you can store the order ID in the user's orders array)
    const user = await User.findById(req.user._id);
    user.orders.push(newOrder._id);
    await user.save();

    // Respond with the order details (including the order ID)
    res.status(200).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to place order');
  }
});

// Get order details by ID (for order summary page)
router.get('/order-summary/:id', requireLogin, async (req, res) => {
  const orderId = req.params.id;

  try {
    // Find the order by ID, populate the items with painting details
    const order = await Order.findById(orderId).populate('items.productId');

    // Ensure the order exists and belongs to the logged-in user
    if (!order) {
      return res.status(404).send('Order not found');
    }

    // If the order exists, check that the user is authorized to view it
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send('You are not authorized to view this order');
    }

    // Send the order details to the front-end for rendering
    res.status(200).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving order details');
  }
});
// Confirm an order by ID
router.post('/confirm-order/:id', requireLogin, async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure that the logged-in user owns the order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    // Mark the order as confirmed
    order.status = 'confirmed';
    order.confirmedAt = new Date();
    await order.save();

    res.status(200).json({ message: 'Order confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error confirming order' });
  }
});
// View all orders of the logged-in user
router.get('/my-orders', requireLogin, async (req, res) => {
  try {
    const userWithOrders = await User.findById(req.user._id)
      .populate({
        path: 'orders',
        populate: {
          path: 'items.productId', // so we can display painting details
        },
        options: { sort: { createdAt: -1 } }
      });

    res.status(200).json({ orders: userWithOrders.orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;
