import express from 'express';
import { login, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

//protected routes (token gerektirir)
router.get('/me', authenticate, getCurrentUser)
// Gelecekte eklenecekler:
// router.post('/register', register);
// router.post('/logout', logout);
// router.post('/refresh-token', refreshToken);

export default router;