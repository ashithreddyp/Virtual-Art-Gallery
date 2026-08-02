const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  shippingAddress: String,
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
  orders: [{ date: Date, items: Array, shipping: String }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // <-- Fixed comma here
});

// Password comparison method for login
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
