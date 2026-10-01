const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    base: { type: String, required: true },
    sauce: { type: String, required: true },
    cheese: { type: String, required: true },
    vegetables: [{ type: String }],
    pizzaName: { type: String, default: 'Custom Pizza' },
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryFee: {
    type: Number,
    default: 40,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryAddress: {
    street: { type: String, default: '123 Food Street' },
    city: { type: String, default: 'Pizza City' },
    postalCode: { type: String, default: '10001' },
    phone: { type: String, default: '9876543210' },
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  paymentId: {
    type: String,
    default: null,
  },
  orderStatus: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
    default: 'Order Received',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
