import express from 'express';
import {
  getRecommendations,
  analyzeResume,
  chat,
  getChatHistory,
} from '../controllers/aiController';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import {
  resumeAnalyzeSchema,
  chatSchema,
  recommendationsSchema,
} from '../validations/aiValidation';

const router = express.Router();

// All AI routes require authentication
router.use(protect);

// POST /api/ai/recommendations
router.post('/recommendations', validate(recommendationsSchema), getRecommendations);

// POST /api/ai/resume-analyze
router.post('/resume-analyze', validate(resumeAnalyzeSchema), analyzeResume);

// POST /api/ai/chat
router.post('/chat', validate(chatSchema), chat);

// GET  /api/ai/history
router.get('/history', getChatHistory);

export default router;
