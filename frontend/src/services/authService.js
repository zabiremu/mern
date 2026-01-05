import api from './api';

class AuthService {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();

