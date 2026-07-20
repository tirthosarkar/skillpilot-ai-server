"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = require("../utils/AppError");
const asyncHandler_1 = require("../utils/asyncHandler");
/**
 * Verifies the Bearer token and attaches the user document to req.user.
 * Throws 401 AppError if token is missing, invalid, or user no longer exists.
 */
exports.protect = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError_1.AppError('Not authorized — no token provided', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'changeme_in_production');
    const user = await User_1.default.findById(decoded.id).select('-password');
    if (!user) {
        throw new AppError_1.AppError('The user belonging to this token no longer exists', 401);
    }
    req.user = user;
    next();
});
/**
 * Role-based access control — must be used after protect.
 * Usage: authorize('admin') or authorize('admin', 'moderator')
 */
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError_1.AppError(`Role '${req.user?.role ?? 'unknown'}' is not authorized to access this route`, 403));
        }
        next();
    };
};
exports.authorize = authorize;
