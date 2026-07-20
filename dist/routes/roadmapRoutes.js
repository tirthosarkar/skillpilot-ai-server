"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roadmapController_1 = require("../controllers/roadmapController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const roadmapValidation_1 = require("../validations/roadmapValidation");
const router = express_1.default.Router();
// All roadmap routes require authentication
router.use(authMiddleware_1.protect);
// POST /api/roadmap/generate  — generates AI roadmap (errors if one already exists)
router.post('/generate', (0, validateRequest_1.validate)(roadmapValidation_1.generateRoadmapSchema), roadmapController_1.generateRoadmap);
// GET    /api/roadmap         — get current user's roadmap
// DELETE /api/roadmap         — delete roadmap (allows re-generation)
router.route('/').get(roadmapController_1.getMyRoadmap).delete(roadmapController_1.deleteRoadmap);
// PATCH /api/roadmap/:nodeId  — update a single node's status
router.patch('/:nodeId', (0, validateRequest_1.validate)(roadmapValidation_1.updateNodeStatusSchema), roadmapController_1.updateNodeStatus);
exports.default = router;
