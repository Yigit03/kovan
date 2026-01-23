import express from 'express';
import { login } from '../controllers/authController';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// Gelecekte eklenecekler:
// router.post('/register', register);
// router.post('/logout', logout);
// router.post('/refresh-token', refreshToken);

export default router;