import * as commentService from './comment.service.js';
import {
  emitNewComment,
  emitCommentUpdate,
  emitCommentDelete,
} from '../../config/socket.js';

export const getAllComments = async (req, res, next) => {
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
};

export const getComment = async (req, res, next) => {
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
};

export const createComment = async (req, res, next) => {
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
};

export const updateComment = async (req, res, next) => {
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
};

export const deleteComment = async (req, res, next) => {
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
};

export const likeComment = async (req, res, next) => {
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
};

export const dislikeComment = async (req, res, next) => {
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
};

export const getReplies = async (req, res, next) => {
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
};

