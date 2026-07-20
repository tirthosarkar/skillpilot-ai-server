import express from 'express';
import {
  getAllUsers,
  getUserById,
  adminUpdateUser,
  deleteUser,
  getProfile,
  updateProfile,
} from '../controllers/userController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import {
  updateProfileSchema,
  adminUpdateUserSchema,
} from '../validations/userValidation';

const router = express.Router();

// ─── Self routes (any authenticated user) ────────────────────────────────────
router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, validate(updateProfileSchema), updateProfile);

// ─── Admin-only routes ────────────────────────────────────────────────────────
router
  .route('/')
  .get(protect, authorize('admin'), getAllUsers);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), validate(adminUpdateUserSchema), adminUpdateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;
