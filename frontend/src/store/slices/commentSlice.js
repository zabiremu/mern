import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../../services/commentService';
import { toast } from 'react-toastify';

const initialState = {
  comments: [],
  currentComment: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  sortBy: 'createdAt',
  order: 'desc',
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await commentService.getComments(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch comments';
      return rejectWithValue(message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await commentService.createComment(commentData);
      toast.success('Comment added successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create comment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, commentData }, { rejectWithValue }) => {
    try {
      const response = await commentService.updateComment(id, commentData);
      toast.success('Comment updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update comment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(id);
      toast.success('Comment deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete comment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await commentService.likeComment(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to like comment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const dislikeComment = createAsyncThunk(
  'comments/dislikeComment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await commentService.dislikeComment(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to dislike comment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addCommentRealtime: (state, action) => {
      const exists = state.comments.find((c) => c._id === action.payload._id);
      if (!exists) {
        state.comments.unshift(action.payload);
        state.pagination.total += 1;
      }
    },
    updateCommentRealtime: (state, action) => {
      const index = state.comments.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
    deleteCommentRealtime: (state, action) => {
      state.comments = state.comments.filter((c) => c._id !== action.payload);
      state.pagination.total -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data.comments;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
      });
  },
});

export const {
  setSortBy,
  setOrder,
  clearError,
  addCommentRealtime,
  updateCommentRealtime,
  deleteCommentRealtime,
} = commentSlice.actions;

export default commentSlice.reducer;

