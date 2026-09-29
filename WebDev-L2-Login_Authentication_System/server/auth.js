const express = require('express');
const bcrypt = require('bcrypt');
const { findUserByUsernameOrEmail, createUser } = require('./database');

const router = express.Router();

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation helper: at least 8 chars and at least 1 number
const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 8 && /\d/.test(password);
};

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check for empty fields
    if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    // 2. Validate email format
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // 3. Validate password rules (min 8 chars, at least 1 number)
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and contain at least 1 number.'
      });
    }

    // 4. Duplicate user check (username or email)
    const existingUser = await findUserByUsernameOrEmail(cleanUsername);
    const existingEmail = await findUserByUsernameOrEmail(cleanEmail);

    if (existingUser || existingEmail) {
      return res.status(409).json({ error: 'Username or email is already registered.' });
    }

    // 5. Hash password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 6. Save user to SQLite
    const newUser = await createUser(cleanUsername, cleanEmail, passwordHash);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Redirecting to login...',
      redirectUrl: '/login'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Check for empty fields
    if (!identifier || !password || !identifier.trim() || !password.trim()) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const cleanIdentifier = identifier.trim();

    // 2. Find user by username or email
    const user = await findUserByUsernameOrEmail(cleanIdentifier);

    // Use one generic error for invalid credentials to avoid revealing user existence
    const genericAuthError = 'Invalid username/email or password.';

    if (!user) {
      return res.status(401).json({ error: genericAuthError });
    }

    // 3. Compare password with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: genericAuthError });
    }

    // 4. Create authentication session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      redirectUrl: '/dashboard',
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Could not log out. Please try again.' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
        redirectUrl: '/login'
      });
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Already logged out.',
      redirectUrl: '/login'
    });
  }
});

// Current user info API for authenticated dashboard
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  return res.status(401).json({ error: 'Not authenticated.' });
});

module.exports = router;
