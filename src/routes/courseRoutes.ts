import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../validations/courseValidation';

const router = express.Router();

// GET  /api/courses        — public, supports ?search=&level=&category=&page=&limit=&sort=
// POST /api/courses        — admin only
router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('admin'), validate(createCourseSchema), createCourse);

// GET    /api/courses/:id  — public
// PUT    /api/courses/:id  — admin only, validated
// DELETE /api/courses/:id  — admin only
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin'), validate(updateCourseSchema), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

export default router;
