const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Bases', 'Sauces', 'Cheeses', 'Vegetables'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    default: 0,
    min: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 50,
    min: 0,
  },
  threshold: {
    type: Number,
    required: [true, 'Low stock threshold is required'],
    default: 20,
    min: 1,
  },
  description: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

inventorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
