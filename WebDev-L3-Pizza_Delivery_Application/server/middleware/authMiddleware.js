const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const secret = process.env.JWT_SECRET || 'pizzahub_jwt_super_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'User not found or session expired.' });
    }

    req.user = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

module.exports = authenticateUser;
