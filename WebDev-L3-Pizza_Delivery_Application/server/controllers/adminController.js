const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { getIO } = require('../socket');

const generateAdminToken = (user) => {
  const secret = process.env.JWT_SECRET || 'pizzahub_jwt_super_secret_key_2026';
  return jwt.sign(
    {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: 'admin',
    },
    secret,
    { expiresIn: '7d' }
  );
};

// 1. Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await User.findOne({ email: email.toLowerCase().trim() });
    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized. Admin credentials invalid.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Unauthorized. Admin credentials invalid.' });
    }

    const token = generateAdminToken(admin);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully.',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Server error during admin login.' });
  }
};

// 2. Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $ne: 'Sent to Delivery' },
    });

    const lowStockItems = await Inventory.countDocuments({
      $expr: { $lte: ['$stock', '$threshold'] },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        lowStockItems,
        todayOrders,
      },
      recentOrders,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ message: 'Failed to fetch dashboard statistics.' });
  }
};

// 3. Get All Inventory Items
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1, name: 1 });
    return res.status(200).json({ success: true, items });
  } catch (err) {
    console.error('Get inventory error:', err);
    return res.status(500).json({ message: 'Failed to fetch inventory items.' });
  }
};

// 4. Update Inventory Stock (Manual stock update)
exports.updateInventoryStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, threshold } = req.body;

    if (stock === undefined && threshold === undefined) {
      return res.status(400).json({ message: 'Stock or threshold value is required.' });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    if (stock !== undefined) {
      const stockNum = Number(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ message: 'Stock must be a non-negative number.' });
      }
      item.stock = stockNum;
    }

    if (threshold !== undefined) {
      const threshNum = Number(threshold);
      if (!isNaN(threshNum) && threshNum >= 0) {
        item.threshold = threshNum;
      }
    }

    item.updatedAt = new Date();
    await item.save();

    return res.status(200).json({
      success: true,
      message: `${item.name} stock updated successfully.`,
      item,
    });
  } catch (err) {
    console.error('Update inventory error:', err);
    return res.status(500).json({ message: 'Failed to update inventory.' });
  }
};

// 5. Get All Orders (Order Management)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Get all orders error:', err);
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// 6. Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Broadcast real-time order status update via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.emit('orderStatusUpdated', order);
        console.log(`📡 Socket.IO emitted orderStatusUpdated for Order #${order._id} -> "${status}"`);
      }
    } catch (socketErr) {
      console.warn('Socket emit warning:', socketErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}".`,
      order,
    });
  } catch (err) {
    console.error('Update order status error:', err);
    return res.status(500).json({ message: 'Failed to update order status.' });
  }
};
