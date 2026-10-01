const Order = require('../models/Order');
const { validateAndCalculatePrice } = require('../services/inventoryService');

// 1. Create a Pending Order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items) {
      return res.status(400).json({ message: 'Pizza selections are required.' });
    }

    // Server-side validation of stock and genuine price calculation
    const validationResult = await validateAndCalculatePrice(items);
    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message });
    }

    const { subtotal, deliveryFee, totalAmount } = validationResult;

    const newOrder = await Order.create({
      userId: req.user.userId,
      items: {
        base: items.base,
        sauce: items.sauce,
        cheese: items.cheese,
        vegetables: items.vegetables || [],
        pizzaName: items.pizzaName || 'Custom Craft Pizza',
      },
      subtotal,
      deliveryFee,
      totalAmount,
      deliveryAddress: deliveryAddress || {
        street: '123 Food Street',
        city: 'Pizza City',
        postalCode: '10001',
        phone: '9876543210',
      },
      paymentStatus: 'Pending',
      orderStatus: 'Order Received',
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully. Proceed to payment.',
      order: newOrder,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Server error creating order.' });
  }
};

// 2. Get User's Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Get my orders error:', err);
    return res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
};

// 3. Get Single Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Verify ownership if not admin
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this order.' });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('Get order by id error:', err);
    return res.status(500).json({ message: 'Failed to fetch order details.' });
  }
};
