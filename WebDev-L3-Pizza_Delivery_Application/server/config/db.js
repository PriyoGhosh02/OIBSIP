const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pizzahub';
  
  try {
    // Attempt standard connection with 10-second timeout for cloud/Atlas connections
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to local/specified MongoDB (${err.message}).`);
    console.log('🔄 Starting embedded MongoDB Memory Server for seamless development...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ Embedded MongoDB connected successfully at ${memUri}`);
    } catch (memErr) {
      console.error('❌ Failed to start embedded MongoDB Memory Server:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
