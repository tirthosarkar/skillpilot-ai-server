"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const authService_1 = require("../services/authService");
const asyncHandler_1 = require("../utils/asyncHandler");
const sendResponse_1 = require("../utils/sendResponse");
const AppError_1 = require("../utils/AppError");
// ─── POST /api/auth/register ─────────────────────────────────────────────────
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { name, email, password } = req.body;
    const exists = await User_1.default.findOne({ email });
    if (exists)
        throw new AppError_1.AppError('An account with this email already exists', 409);
    const user = await User_1.default.create({ name, email, password });
    (0, sendResponse_1.sendResponse)(res, 201, {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: (0, authService_1.generateToken)(user.id),
    }, 'Account created successfully');
});
// ─── POST /api/auth/login ────────────────────────────────────────────────────
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    (0, sendResponse_1.sendResponse)(res, 200, {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: (0, authService_1.generateToken)(user.id),
    });
});
// ─── GET /api/auth/me ────────────────────────────────────────────────────────
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    // req.user is already populated by protect middleware
    (0, sendResponse_1.sendResponse)(res, 200, req.user);
});
