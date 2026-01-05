import express from 'express';
import authController from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

router.get('/me', protect, authController.getMe.bind(authController));

export default router;

