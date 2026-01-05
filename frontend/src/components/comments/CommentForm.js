import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/slices/commentSlice';
import './CommentForm.scss';

const CommentForm = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.comments);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim() === '') {
      return;
    }

    dispatch(createComment({ text }));
    setText('');
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-form-placeholder">
        <p>Please login to add a comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="comment-input"
        rows="4"
        maxLength="1000"
        disabled={loading}
      />
      <div className="form-footer">
        <span className="char-count">
          {text.length}/1000
        </span>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || text.trim() === ''}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;

