import authService from './auth.service.js';
import { sendTokenResponse } from '../../utils/jwt.js';
import { AppError } from '../../utils/errorHandler.js';

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      sendTokenResponse(user, 201, res);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      sendTokenResponse(user, 200, res);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();

