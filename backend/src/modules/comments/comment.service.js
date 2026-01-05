import commentRepository from './comment.repository.js';
import { AppError } from '../../utils/errorHandler.js';

class CommentService {
  async getAllComments(options) {
    const { comments, total } = await commentRepository.findAll(options);

    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getCommentById(id) {
    const comment = await commentRepository.findById(id);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    return comment;
  }

  async createComment(commentData, userId) {
    const comment = await commentRepository.create({
      ...commentData,
      author: userId,
    });

    return comment;
  }

  async updateComment(id, updateData, userId) {
    const comment = await commentRepository.findById(id);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author._id.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to update this comment', 403);
    }

    const updatedComment = await commentRepository.update(id, updateData);
    return updatedComment;
  }

  async deleteComment(id, userId) {
    const comment = await commentRepository.findById(id);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author._id.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to delete this comment', 403);
    }

    await commentRepository.delete(id);
    return { message: 'Comment deleted successfully' };
  }

  async likeComment(commentId, userId) {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // toggle like - if already liked, remove it
    const hasLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

    let updatedComment;
    if (hasLiked) {
      updatedComment = await commentRepository.removeLike(commentId, userId);
    } else {
      updatedComment = await commentRepository.addLike(commentId, userId);
    }

    return updatedComment;
  }

  async dislikeComment(commentId, userId) {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const hasDisliked = comment.dislikes.some(
      (id) => id.toString() === userId.toString()
    );

    let updatedComment;
    if (hasDisliked) {
      updatedComment = await commentRepository.removeDislike(commentId, userId);
    } else {
      updatedComment = await commentRepository.addDislike(commentId, userId);
    }

    return updatedComment;
  }

  async getReplies(parentCommentId) {
    const parentComment = await commentRepository.findById(parentCommentId);

    if (!parentComment) {
      throw new AppError('Parent comment not found', 404);
    }

    const replies = await commentRepository.getReplies(parentCommentId);
    return replies;
  }
}

export default new CommentService();

