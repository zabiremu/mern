import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import commentRoutes from '../modules/comments/comment.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/comments', commentRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

