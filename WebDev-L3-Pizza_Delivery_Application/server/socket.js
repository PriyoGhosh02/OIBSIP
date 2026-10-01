const { Server } = require('socket.io');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    socket.on('joinOrderRoom', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`📦 Socket ${socket.id} joined room order_${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected from Socket.IO: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
