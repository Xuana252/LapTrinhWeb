const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true },
  discount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Category', categorySchema);