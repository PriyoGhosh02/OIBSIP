const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'pizzahub_jwt_super_secret_key_2026';
  return jwt.sign(
    {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user);

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

// 1. Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'user',
      isVerified: true,
      verificationToken: null,
    });

    return sendTokenResponse(newUser, 201, res, 'Registration successful! Welcome to PizzaHub.');
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

// 2. Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Account verified successfully! You can now log in.',
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return res.status(500).json({ message: 'Server error during email verification.' });
  }
};

// 3. User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// 4. Logout
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// 5. Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return 200 to prevent email enumeration
      return res.status(200).json({
        message: 'If an account exists with this email, a password reset link has been dispatched.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (mailErr) {
      console.error('Failed to send reset email:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email (valid for 15 minutes).',
      resetToken, // Returned for effortless development testing
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Server error processing password reset.' });
  }
};

// 6. Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully. You can now login with your new password.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error resetting password.' });
  }
};

// 7. Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};
