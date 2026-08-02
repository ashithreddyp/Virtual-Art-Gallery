const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Painting', required: true },
      title:     { type: String,  required: true },
      price:     { type: Number,  required: true },
      quantity:  { type: Number,  required: true },
      image:     { type: String,  required: true },
    },
  ],

  shippingInfo: {
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    number:      { type: String, required: true },
    address:     { type: String, required: true },
    city:        { type: String, required: true },
    postalCode:  { type: String, required: true },
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },

  confirmedAt: { type: Date },            // filled when the user clicks “Confirm Order”
  createdAt:   { type: Date, default: Date.now },
});

// Re‑use existing model in dev hot‑reloads, otherwise create it
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
