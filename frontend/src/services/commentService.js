import api from './api';

class CommentService {
  async getComments(params = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = params;
    const response = await api.get('/comments', {
      params: { page, limit, sortBy, order },
    });
    return response.data;
  }

  async getComment(id) {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  }

  async createComment(commentData) {
    const response = await api.post('/comments', commentData);
    return response.data;
  }

  async updateComment(id, commentData) {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  }

  async deleteComment(id) {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }

  async likeComment(id) {
    const response = await api.post(`/comments/${id}/like`);
    return response.data;
  }

  async dislikeComment(id) {
    const response = await api.post(`/comments/${id}/dislike`);
    return response.data;
  }

  async getReplies(id) {
    const response = await api.get(`/comments/${id}/replies`);
    return response.data;
  }
}

export default new CommentService();

