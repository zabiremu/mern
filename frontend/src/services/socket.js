import { io } from 'socket.io-client';
import store from '../store/store';
import {
  addCommentRealtime,
  updateCommentRealtime,
  deleteCommentRealtime,
} from '../store/slices/commentSlice';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('✅ Socket.IO connected');
    socket.emit('join:comments');
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket.IO disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  socket.on('comment:new', (comment) => {
    console.log('New comment received:', comment);
    store.dispatch(addCommentRealtime(comment));
  });

  socket.on('comment:update', (comment) => {
    console.log('Comment updated:', comment);
    store.dispatch(updateCommentRealtime(comment));
  });

  socket.on('comment:delete', (commentId) => {
    console.log('Comment deleted:', commentId);
    store.dispatch(deleteCommentRealtime(commentId));
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.emit('leave:comments');
    socket.disconnect();
    socket = null;
  }
};

