import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import {
  likeComment,
  dislikeComment,
  deleteComment,
  updateComment,
} from '../../store/slices/commentSlice';
import './CommentCard.scss';

const CommentCard = ({ comment }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isAuthor = user?._id === comment.author._id;

  const hasLiked = comment.likes?.includes(user?._id);
  const hasDisliked = comment.dislikes?.includes(user?._id);

  const handleLike = () => {
    if (!isAuthenticated) {
      return;
    }
    dispatch(likeComment(comment._id));
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      return;
    }
    dispatch(dislikeComment(comment._id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(comment._id));
    }
  };

  const handleUpdate = () => {
    if (editText.trim() === '') {
      return;
    }
    dispatch(updateComment({ id: comment._id, commentData: { text: editText } }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">
            {comment.author.username.charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <h4>{comment.author.username}</h4>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
        </div>

        {isAuthor && (
          <div className="comment-actions">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-icon"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button onClick={handleDelete} className="btn-icon" title="Delete">
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      <div className="comment-body">
        {isEditing ? (
          <div className="comment-edit">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-textarea"
              rows="3"
            />
            <div className="edit-actions">
              <button onClick={handleUpdate} className="btn btn-primary btn-sm">
                Save
              </button>
              <button onClick={handleCancelEdit} className="btn btn-outline btn-sm">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
      </div>

      <div className="comment-footer">
        <button
          onClick={handleLike}
          className={`btn-reaction ${hasLiked ? 'active' : ''}`}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? 'Login to like' : 'Like'}
        >
          <FaThumbsUp />
          <span>{comment.likeCount || 0}</span>
        </button>

        <button
          onClick={handleDislike}
          className={`btn-reaction ${hasDisliked ? 'active' : ''}`}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? 'Login to dislike' : 'Dislike'}
        >
          <FaThumbsDown />
          <span>{comment.dislikeCount || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentCard;

