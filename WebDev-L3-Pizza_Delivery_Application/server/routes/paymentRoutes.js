const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/create', authenticateUser, paymentController.createRazorpayOrder);
router.post('/verify', authenticateUser, paymentController.verifyPayment);

module.exports = router;
