const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.get('/verify/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', authenticateUser, authController.getProfile);

module.exports = router;
