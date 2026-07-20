"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const aiValidation_1 = require("../validations/aiValidation");
const router = express_1.default.Router();
// All AI routes require authentication
router.use(authMiddleware_1.protect);
// POST /api/ai/recommendations
router.post('/recommendations', (0, validateRequest_1.validate)(aiValidation_1.recommendationsSchema), aiController_1.getRecommendations);
// POST /api/ai/resume-analyze
router.post('/resume-analyze', (0, validateRequest_1.validate)(aiValidation_1.resumeAnalyzeSchema), aiController_1.analyzeResume);
// POST /api/ai/chat
router.post('/chat', (0, validateRequest_1.validate)(aiValidation_1.chatSchema), aiController_1.chat);
// GET  /api/ai/history
router.get('/history', aiController_1.getChatHistory);
exports.default = router;
