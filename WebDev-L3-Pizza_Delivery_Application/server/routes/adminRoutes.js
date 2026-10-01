const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateUser = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Public admin login
router.post('/login', adminController.adminLogin);

// Protected admin routes
router.get('/dashboard', authenticateUser, requireAdmin, adminController.getDashboardStats);
router.get('/orders', authenticateUser, requireAdmin, adminController.getAllOrders);
router.patch('/orders/:id/status', authenticateUser, requireAdmin, adminController.updateOrderStatus);
router.get('/inventory', authenticateUser, requireAdmin, adminController.getInventory);
router.patch('/inventory/:id', authenticateUser, requireAdmin, adminController.updateInventoryStock);

module.exports = router;
