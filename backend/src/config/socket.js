import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js';

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        socket.userId = null;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      socket.userId = null;
      next(); 
    }
  });

  io.on('connection', (socket) => {
    const username = socket.username || 'Guest';
    console.log(`✅ User connected: ${socket.id} (${username})`);

    socket.on('join:comments', () => {
      socket.join('comments');
      console.log(`User ${socket.id} joined comments room`);
    });

    socket.on('leave:comments', () => {
      socket.leave('comments');
      console.log(`User ${socket.id} left comments room`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

const emitNewComment = (comment) => {
  if (io) {
    io.to('comments').emit('comment:new', comment);
  }
};

const emitCommentUpdate = (comment) => {
  if (io) {
    io.to('comments').emit('comment:update', comment);
  }
};

const emitCommentDelete = (commentId) => {
  if (io) {
    io.to('comments').emit('comment:delete', commentId);
  }
};

export {
  initializeSocket,
  getIO,
  emitNewComment,
  emitCommentUpdate,
  emitCommentDelete,
};

