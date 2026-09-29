const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./server/auth');
const { requireAuth, redirectIfAuth } = require('./server/middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: 'taskhub-super-secret-key-production-ready-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if running over HTTPS in production
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

// Serve static assets from public folder (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Mount auth routes directly to support POST /register, POST /login, POST /logout
app.use('/', authRoutes);
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);

// Page routes
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

app.get('/login', redirectIfAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', redirectIfAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Fallback 404 handler
app.use((req, res) => {
  if (req.accepts('html')) {
    return res.redirect('/login');
  }
  res.status(404).json({ error: 'Resource not found' });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` TaskHub Authentication Server is running`);
  console.log(` Access URL: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
