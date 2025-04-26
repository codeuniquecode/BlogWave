// services/socketService.js

let ioInstance;

const initializeSocket = (server) => {
  const { Server } = require('socket.io');
  ioInstance = new Server(server);

  ioInstance.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  console.log('Socket.io initialized');
};

const getSocket = () => {
  if (!ioInstance) {
    throw new Error('Socket.io instance has not been initialized yet.');
  }
  return ioInstance;
};

// 🔥 Easy function to send a notification
const sendNotification = (header, body) => {
  if (!ioInstance) {
    throw new Error('Socket.io instance has not been initialized yet.');
  }

  ioInstance.emit('showNotification', { header, body });
};

module.exports = {
  initializeSocket,
  getSocket,
  sendNotification,
};
