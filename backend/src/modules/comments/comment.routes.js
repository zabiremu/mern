import express from 'express';
import commentController from './comment.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', commentController.getAllComments.bind(commentController));
router.get('/:id', commentController.getComment.bind(commentController));
router.get('/:id/replies', commentController.getReplies.bind(commentController));

router.post('/', protect, commentController.createComment.bind(commentController));
router.put('/:id', protect, commentController.updateComment.bind(commentController));
router.delete('/:id', protect, commentController.deleteComment.bind(commentController));
router.post('/:id/like', protect, commentController.likeComment.bind(commentController));
router.post('/:id/dislike', protect, commentController.dislikeComment.bind(commentController));

export default router;

