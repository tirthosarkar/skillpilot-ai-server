"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.adminUpdateUser = exports.updateUserProfile = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = require("../utils/AppError");
/**
 * Returns a paginated list of users (admin use).
 */
const getAllUsers = async (query) => {
    const page = Math.max(1, parseInt(query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
    const skip = (page - 1) * limit;
    const filter = {};
    if (query.role) {
        filter.role = query.role;
    }
    if (query.search) {
        filter.$or = [
            {
                name: {
                    $regex: query.search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: query.search,
                    $options: "i",
                },
            },
        ];
    }
    const [users, total] = await Promise.all([
        User_1.default.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        User_1.default.countDocuments(filter),
    ]);
    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getAllUsers = getAllUsers;
/**
 * Returns a single user by ID.
 */
const getUserById = async (id) => {
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    return user;
};
exports.getUserById = getUserById;
/**
 * Update own profile.
 */
const updateUserProfile = async (id, data) => {
    const user = await User_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    return user;
};
exports.updateUserProfile = updateUserProfile;
/**
 * Admin update user.
 */
const adminUpdateUser = async (id, data) => {
    const user = await User_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    return user;
};
exports.adminUpdateUser = adminUpdateUser;
/**
 * Delete user.
 */
const deleteUser = async (targetId, requesterId) => {
    if (targetId === requesterId) {
        throw new AppError_1.AppError("You cannot delete your own account", 400);
    }
    const user = await User_1.default.findByIdAndDelete(targetId);
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
};
exports.deleteUser = deleteUser;
