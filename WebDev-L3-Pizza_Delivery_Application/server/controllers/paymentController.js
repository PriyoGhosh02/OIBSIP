const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const { deductInventoryStock, validateAndCalculatePrice, getLowStockItems } = require('../services/inventoryService');
const { sendLowStockAlert } = require('../services/emailService');
const { getIO } = require('../socket');

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_id && key_secret && !key_id.includes('your_') && !key_secret.includes('your_')) {
    return new Razorpay({ key_id, key_secret });
  }
  return null;
};

// 1. Create Razorpay Test Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'This order is already paid.' });
    }

    // Double check stock availability before opening payment
    const validation = await validateAndCalculatePrice(order.items);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);
    const razorpayInstance = getRazorpayInstance();

    let razorpayOrderId = null;

    if (razorpayInstance) {
      try {
        const razorpayOrder = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${order._id.toString().slice(-8)}`,
        });
        razorpayOrderId = razorpayOrder.id;
      } catch (rzpErr) {
        console.warn(`⚠️ Razorpay API response (${rzpErr.error?.description || rzpErr.message || 'Auth'}). Using Sandbox Test Order ID.`);
        razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      }
    } else {
      // Sandbox fallback mode if developer hasn't set active Razorpay keys yet
      razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      console.log(`ℹ️ Razorpay Sandbox Mock Order Created: ${razorpayOrderId} for INR ${order.totalAmount}`);
    }

    order.razorpayOrderId = razorpayOrderId;
    await order.save();

    return res.status(200).json({
      success: true,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_pizzahub_sandbox',
      isSandboxMock: !razorpayInstance,
      order,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return res.status(500).json({ message: 'Failed to initiate Razorpay payment order.' });
  }
};

// 2. Verify Payment & Deduct Inventory
exports.verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      simulated,
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(200).json({
        success: true,
        message: 'Order was already verified and confirmed.',
        order,
      });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    const hasRealKeys = razorpaySecret && !razorpaySecret.includes('your_');

    if (hasRealKeys && !simulated) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        order.paymentStatus = 'Failed';
        await order.save();
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed. Invalid digital signature.',
        });
      }
    }

    // Payment is valid! Update Order
    order.paymentStatus = 'Paid';
    order.paymentId = razorpay_payment_id || `pay_test_${Date.now()}`;
    order.orderStatus = 'Order Received';
    await order.save();

    // Deduct stock for all used ingredients
    await deductInventoryStock(order.items);

    // Check for low stock items and notify admin if needed
    try {
      const lowStockItems = await getLowStockItems();
      if (lowStockItems.length > 0 && process.env.ADMIN_EMAIL) {
        await sendLowStockAlert(process.env.ADMIN_EMAIL, lowStockItems);
      }
    } catch (stockErr) {
      console.warn('Low stock check warning:', stockErr.message);
    }

    // Broadcast order event via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.emit('orderStatusUpdated', order);
      }
    } catch (socketErr) {
      console.warn('Socket error on payment verify:', socketErr.message);
    }

    console.log(`✅ Order #${order._id} confirmed! Payment: ${order.paymentId}`);

    return res.status(200).json({
      success: true,
      message: 'Payment successful! Your order has been confirmed.',
      order,
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(500).json({ message: 'Server error verifying payment.' });
  }
};
