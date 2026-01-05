import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, setSortBy, setOrder } from '../../store/slices/commentSlice';
import CommentCard from './CommentCard';
import Pagination from './Pagination';
import './CommentList.scss';

const CommentList = () => {
  const dispatch = useDispatch();
  const { comments, loading, pagination, sortBy, order } = useSelector(
    (state) => state.comments
  );

  useEffect(() => {
    dispatch(fetchComments({ page: 1, limit: 10, sortBy, order }));
  }, [dispatch, sortBy, order]);

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  const handleOrderChange = (e) => {
    dispatch(setOrder(e.target.value));
  };

  const handlePageChange = (page) => {
    dispatch(fetchComments({ page, limit: 10, sortBy, order }));
  };

  if (loading && comments.length === 0) {
    return <div className="loading">Loading comments...</div>;
  }

  return (
    <div className="comment-list">
      <div className="comment-list-header">
        <h2>Comments ({pagination.total})</h2>

        <div className="sort-controls">
          <label>
            Sort by:
            <select value={sortBy} onChange={handleSortChange}>
              <option value="createdAt">Newest</option>
              <option value="likes">Most Liked</option>
              <option value="dislikes">Most Disliked</option>
            </select>
          </label>

          <label>
            Order:
            <select value={order} onChange={handleOrderChange}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div className="comments-container">
            {comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;

