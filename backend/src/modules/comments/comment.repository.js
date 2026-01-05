import Comment from './comment.model.js';

export const findAll = async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      parentComment = null,
    } = options;

    const skip = (page - 1) * limit;

    // handle different sort options
    let sortObj = {};
    if (sortBy === 'likes') {
      sortObj = { likeCount: order === 'desc' ? -1 : 1 };
    } else if (sortBy === 'dislikes') {
      sortObj = { dislikeCount: order === 'desc' ? -1 : 1 };
    } else {
      sortObj[sortBy] = order === 'desc' ? -1 : 1;
    }

    const filter = { parentComment };

    // use aggregation for like/dislike sorting
    if (sortBy === 'likes' || sortBy === 'dislikes') {
      const comments = await Comment.aggregate([
        { $match: filter },
        {
          $addFields: {
            likeCount: { $size: '$likes' },
            dislikeCount: { $size: '$dislikes' },
          },
        },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: '$author' },
        {
          $project: {
            'author.password': 0,
          },
        },
      ]);

      const total = await Comment.countDocuments(filter);

      return { comments, total };
    }

    const comments = await Comment.find(filter)
      .populate('author', '-password')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(filter);

    return { comments, total };
};

export const findById = async (id) => {
  return await Comment.findById(id).populate('author', '-password');
};

export const create = async (commentData) => {
  const comment = await Comment.create(commentData);
  return await comment.populate('author', '-password');
};

export const update = async (id, updateData) => {
  const comment = await Comment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('author', '-password');

  return comment;
};

export { deleteComment as delete };
const deleteComment = async (id) => {
  return await Comment.findByIdAndDelete(id);
};

export const addLike = async (commentId, userId) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    },
    { new: true }
  ).populate('author', '-password');
};

export const removeLike = async (commentId, userId) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    {
      $pull: { likes: userId },
    },
    { new: true }
  ).populate('author', '-password');
};

export const addDislike = async (commentId, userId) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    },
    { new: true }
  ).populate('author', '-password');
};

export const removeDislike = async (commentId, userId) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    {
      $pull: { dislikes: userId },
    },
    { new: true }
  ).populate('author', '-password');
};

export const getReplies = async (parentCommentId) => {
  return await Comment.find({ parentComment: parentCommentId })
    .populate('author', '-password')
    .sort({ createdAt: -1 });
};

