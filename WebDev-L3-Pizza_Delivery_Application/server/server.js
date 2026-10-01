require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const seedDatabase = require('./seedAdmin');
const { initSocket } = require('./socket');
const { startStockMonitor, runStockCheck } = require('./jobs/stockMonitor');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middleware
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Request logging (clean format)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`📡 [${req.method}] ${req.path}`);
  }
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', pizzaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PizzaHub Server is online and ready.',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    // Start background scheduled jobs
    startStockMonitor();
    // Run an initial low stock check
    await runStockCheck();

    server.listen(PORT, () => {
      console.log(`\n🍕 =================================================`);
      console.log(`   PizzaHub Server running on http://localhost:${PORT}`);
      console.log(`   Client URL: ${clientUrl}`);
      console.log(`   Admin Credentials: admin@pizzahub.test / AdminPassword123`);
      console.log(`🍕 =================================================\n`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
};

startServer();
