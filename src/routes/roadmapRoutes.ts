import express from 'express';
import {
  generateRoadmap,
  getMyRoadmap,
  updateNodeStatus,
  deleteRoadmap,
} from '../controllers/roadmapController';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import {
  generateRoadmapSchema,
  updateNodeStatusSchema,
} from '../validations/roadmapValidation';

const router = express.Router();

// All roadmap routes require authentication
router.use(protect);

// POST /api/roadmap/generate  — generates AI roadmap (errors if one already exists)
router.post('/generate', validate(generateRoadmapSchema), generateRoadmap);

// GET    /api/roadmap         — get current user's roadmap
// DELETE /api/roadmap         — delete roadmap (allows re-generation)
router.route('/').get(getMyRoadmap).delete(deleteRoadmap);

// PATCH /api/roadmap/:nodeId  — update a single node's status
router.patch('/:nodeId', validate(updateNodeStatusSchema), updateNodeStatus);

export default router;
