const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.models.Painting || mongoose.model('Painting', paintingSchema);
