"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const courseValidation_1 = require("../validations/courseValidation");
const router = express_1.default.Router();
// GET  /api/courses        — public, supports ?search=&level=&category=&page=&limit=&sort=
// POST /api/courses        — admin only
router
    .route('/')
    .get(courseController_1.getCourses)
    .post(authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), (0, validateRequest_1.validate)(courseValidation_1.createCourseSchema), courseController_1.createCourse);
// GET    /api/courses/:id  — public
// PUT    /api/courses/:id  — admin only, validated
// DELETE /api/courses/:id  — admin only
router
    .route('/:id')
    .get(courseController_1.getCourse)
    .put(authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), (0, validateRequest_1.validate)(courseValidation_1.updateCourseSchema), courseController_1.updateCourse)
    .delete(authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), courseController_1.deleteCourse);
exports.default = router;
