import commentService from './comment.service.js';
import {
  emitNewComment,
  emitCommentUpdate,
  emitCommentDelete,
} from '../../config/socket.js';

class CommentController {
  async getAllComments(req, res, next) {
    try {
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        order: req.query.order,
        parentComment: req.query.parentComment || null,
      };

      const result = await commentService.getAllComments(options);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getComment(req, res, next) {
    try {
      const comment = await commentService.getCommentById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createComment(req, res, next) {
    try {
      const comment = await commentService.createComment(
        req.body,
        req.user.id
      );

      emitNewComment(comment);

      res.status(201).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const comment = await commentService.updateComment(
        req.params.id,
        req.body,
        req.user.id
      );

      emitCommentUpdate(comment);

      res.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const result = await commentService.deleteComment(
        req.params.id,
        req.user.id
      );

      emitCommentDelete(req.params.id);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async likeComment(req, res, next) {
    try {
      const comment = await commentService.likeComment(
        req.params.id,
        req.user.id
      );

      emitCommentUpdate(comment);

      res.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async dislikeComment(req, res, next) {
    try {
      const comment = await commentService.dislikeComment(
        req.params.id,
        req.user.id
      );

      emitCommentUpdate(comment);

      res.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getReplies(req, res, next) {
    try {
      const replies = await commentService.getReplies(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          replies,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();

