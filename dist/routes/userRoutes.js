"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const userValidation_1 = require("../validations/userValidation");
const router = express_1.default.Router();
// ─── Self routes (any authenticated user) ────────────────────────────────────
router
    .route('/profile')
    .get(authMiddleware_1.protect, userController_1.getProfile)
    .put(authMiddleware_1.protect, (0, validateRequest_1.validate)(userValidation_1.updateProfileSchema), userController_1.updateProfile);
// ─── Admin-only routes ────────────────────────────────────────────────────────
router
    .route('/')
    .get(authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), userController_1.getAllUsers);
router
    .route('/:id')
    .get(authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), userController_1.getUserById)
    .put(authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), (0, validateRequest_1.validate)(userValidation_1.adminUpdateUserSchema), userController_1.adminUpdateUser)
    .delete(authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), userController_1.deleteUser);
exports.default = router;
