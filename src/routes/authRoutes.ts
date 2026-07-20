import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), registerUser);

// POST /api/auth/login
router.post('/login', validate(loginSchema), loginUser);

// GET /api/auth/me
router.get('/me', protect, getMe);

export default router;
