import User from '../users/user.model.js';
import { AppError } from '../../utils/errorHandler.js';

class AuthService {
  async register(userData) {
    const { username, email, password } = userData;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new AppError('Email already registered', 400);
      }
      if (existingUser.username === username) {
        throw new AppError('Username already taken', 400);
      }
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    return user;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    return user;
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

export default new AuthService();
