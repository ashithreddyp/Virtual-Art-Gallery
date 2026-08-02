const mongoose = require('mongoose');

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links to the User model
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Painting', // Changed from 'Product' to 'Painting' based on previous code
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    }
});

// Avoid model overwriting by checking if it's already defined
const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
