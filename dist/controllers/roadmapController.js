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
exports.deleteRoadmap = exports.updateNodeStatus = exports.getMyRoadmap = exports.generateRoadmap = void 0;
const aiService = __importStar(require("../services/aiService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const sendResponse_1 = require("../utils/sendResponse");
// POST /api/roadmap/generate
exports.generateRoadmap = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { targetRole, currentSkills } = req.body;
    const roadmap = await aiService.generateAndSaveRoadmap(req.user.id, targetRole, currentSkills);
    (0, sendResponse_1.sendResponse)(res, 201, roadmap, "Roadmap generated successfully");
});
// GET /api/roadmap
exports.getMyRoadmap = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const roadmap = await aiService.getUserRoadmap(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, roadmap);
});
// PATCH /api/roadmap/:nodeId
exports.updateNodeStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const nodeId = req.params.nodeId;
    const { status } = req.body;
    const roadmap = await aiService.updateNodeStatus(req.user.id, nodeId, status);
    (0, sendResponse_1.sendResponse)(res, 200, roadmap, "Node status updated");
});
// DELETE /api/roadmap
exports.deleteRoadmap = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await aiService.deleteUserRoadmap(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, null, "Roadmap deleted — you can now generate a new one");
});
