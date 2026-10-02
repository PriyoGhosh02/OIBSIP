const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse existing database connection
  if (isConnected && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
    const errorMsg = 'MONGODB_URI environment variable is missing in Vercel project settings.';
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const connectionUri = uri || 'mongodb://127.0.0.1:27017/pizzahub';

  try {
    const conn = await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = conn.connections[0].readyState;
    console.log(`✅ MongoDB connected successfully to ${mongoose.connection.host}`);
    return conn;
  } catch (err) {
    // If running in Vercel or production, throw error directly (do not start memory server)
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.error('❌ MongoDB Atlas connection error:', err.message);
      throw err;
    }

    console.warn(`⚠️ Could not connect to local/specified MongoDB (${err.message}).`);
    console.log('🔄 Starting embedded MongoDB Memory Server for seamless development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      isConnected = conn.connections[0].readyState;
      console.log(`✅ Embedded MongoDB connected successfully at ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error('❌ Failed to start embedded MongoDB Memory Server:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
