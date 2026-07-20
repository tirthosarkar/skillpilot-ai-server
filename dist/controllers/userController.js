"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.deleteUser = exports.adminUpdateUser = exports.getUserById = exports.getAllUsers = void 0;
const userService = __importStar(require("../services/userService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const sendResponse_1 = require("../utils/sendResponse");
// GET /api/users (admin)
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { users, pagination } = await userService.getAllUsers(req.query);
    (0, sendResponse_1.sendResponse)(res, 200, users, undefined, {
        count: users.length,
        pagination,
    });
});
// GET /api/users/:id (admin)
exports.getUserById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    (0, sendResponse_1.sendResponse)(res, 200, user);
});
// PUT /api/users/:id (admin)
exports.adminUpdateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = await userService.adminUpdateUser(id, req.body);
    (0, sendResponse_1.sendResponse)(res, 200, user, "User updated");
});
// DELETE /api/users/:id (admin)
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await userService.deleteUser(id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, null, "User deleted successfully");
});
// GET /api/users/profile
exports.getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, user);
});
// PUT /api/users/profile
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, 200, user, "Profile updated");
});
