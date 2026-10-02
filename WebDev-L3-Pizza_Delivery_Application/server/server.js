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
const allowedOrigins = [
  clientUrl,
  'https://onlinepizzadeliverystore.vercel.app',
  'https://pizzahub-five.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serverless DB connection middleware (ensures DB is connected on each serverless hit)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Serverless DB connection error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
      hasMongoUri: !!process.env.MONGODB_URI,
      tip: !process.env.MONGODB_URI
        ? 'MONGODB_URI is not set in Vercel Environment Variables. Add it in Vercel Settings > Environment Variables, then click Redeploy.'
        : 'Check MongoDB Atlas > Network Access. Ensure 0.0.0.0/0 (Allow access from anywhere) is active.',
    });
  }
});

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

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PizzaHub API is running on Vercel.',
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

// When deployed on Vercel serverless, don't start persistent listener; export app directly
if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;
