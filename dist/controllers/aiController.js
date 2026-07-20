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
exports.getChatHistory = exports.chat = exports.analyzeResume = exports.getRecommendations = void 0;
const aiService = __importStar(require("../services/aiService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const sendResponse_1 = require("../utils/sendResponse");
// ─── POST /api/ai/recommendations ────────────────────────────────────────────
exports.getRecommendations = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const userContext = req.body.userContext ?? {
        targetRole: 'Senior Frontend Engineer',
        currentSkills: ['React', 'JavaScript', 'CSS'],
        experienceLevel: 'Intermediate',
    };
    const data = await aiService.generateAndSaveRecommendations(req.user.id, userContext);
    (0, sendResponse_1.sendResponse)(res, 200, data, `${data.length} recommendations generated`);
});
// ─── POST /api/ai/resume-analyze ─────────────────────────────────────────────
exports.analyzeResume = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { resumeText, targetRole } = req.body;
    const data = await aiService.runResumeAnalysis(req.user.id, resumeText, targetRole);
    (0, sendResponse_1.sendResponse)(res, 200, data, 'Resume analysis complete');
});
// ─── POST /api/ai/chat ────────────────────────────────────────────────────────
exports.chat = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { message, contextMemory, chatId } = req.body;
    const session = await aiService.handleChat(req.user.id, message, contextMemory ?? `Target Role: ${req.user?.name}'s goal`, chatId);
    (0, sendResponse_1.sendResponse)(res, 200, session);
});
// ─── GET /api/ai/history ─────────────────────────────────────────────────────
exports.getChatHistory = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const sessions = await aiService.getChatHistory(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, sessions, undefined, { count: sessions.length });
});
