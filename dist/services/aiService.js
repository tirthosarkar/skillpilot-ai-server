"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserRoadmap = exports.updateNodeStatus = exports.getUserRoadmap = exports.generateAndSaveRoadmap = exports.getChatHistory = exports.handleChat = exports.runResumeAnalysis = exports.generateAndSaveRecommendations = void 0;
const geminiService_1 = require("./geminiService");
const Recommendation_1 = __importDefault(require("../models/Recommendation"));
const ResumeAnalysis_1 = __importDefault(require("../models/ResumeAnalysis"));
const AIChat_1 = __importDefault(require("../models/AIChat"));
const Roadmap_1 = __importDefault(require("../models/Roadmap"));
const AppError_1 = require("../utils/AppError");
const mongoose_1 = require("mongoose");
/**
 * Generates AI recommendations, persists to DB, and returns saved docs.
 */
const generateAndSaveRecommendations = async (userId, userContext) => {
    const result = await (0, geminiService_1.generateCareerRecommendations)(userContext);
    return Promise.all(result.recommendations.map((rec) => Recommendation_1.default.create({
        user: new mongoose_1.Types.ObjectId(userId),
        title: rec.title,
        reason: rec.reason,
        type: rec.type,
    })));
};
exports.generateAndSaveRecommendations = generateAndSaveRecommendations;
/**
 * Runs ATS resume analysis, persists, and returns saved doc.
 */
const runResumeAnalysis = async (userId, resumeText, targetRole) => {
    const analysis = await (0, geminiService_1.analyzeResumeContent)(resumeText, targetRole);
    return ResumeAnalysis_1.default.create({
        user: new mongoose_1.Types.ObjectId(userId),
        targetRole,
        atsScore: analysis.atsScore,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
    });
};
exports.runResumeAnalysis = runResumeAnalysis;
/**
 * Sends a message to AI, persists the chat session, returns session.
 */
const handleChat = async (userId, message, contextMemory, chatId) => {
    const reply = await (0, geminiService_1.chatWithAI)(message, contextMemory);
    // Append to existing session
    if (chatId) {
        const session = await AIChat_1.default.findById(chatId);
        if (session && session.user.toString() === userId) {
            session.messages.push({ role: 'user', content: message, timestamp: new Date() }, { role: 'ai', content: reply, timestamp: new Date() });
            return session.save();
        }
    }
    // Create new session
    return AIChat_1.default.create({
        user: new mongoose_1.Types.ObjectId(userId),
        title: `${message.substring(0, 40)}...`,
        messages: [
            { role: 'user', content: message },
            { role: 'ai', content: reply },
        ],
    });
};
exports.handleChat = handleChat;
/**
 * Returns all chat sessions for a user (latest first).
 */
const getChatHistory = async (userId) => {
    return AIChat_1.default.find({ user: new mongoose_1.Types.ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .select('title updatedAt createdAt');
};
exports.getChatHistory = getChatHistory;
/**
 * Generates a roadmap via Gemini and persists it for the user.
 */
const generateAndSaveRoadmap = async (userId, targetRole, currentSkills) => {
    // Check if one already exists
    const existing = await Roadmap_1.default.findOne({ user: new mongoose_1.Types.ObjectId(userId) });
    if (existing) {
        throw new AppError_1.AppError('Roadmap already exists. Delete your current roadmap to generate a new one.', 409);
    }
    const result = await (0, geminiService_1.generateRoadmapNodes)(targetRole, currentSkills);
    const nodes = result.nodes.map((n) => ({
        title: n.title,
        type: n.type,
        status: 'Pending',
    }));
    return Roadmap_1.default.create({
        user: new mongoose_1.Types.ObjectId(userId),
        targetRole,
        nodes,
        progress: 0,
    });
};
exports.generateAndSaveRoadmap = generateAndSaveRoadmap;
/**
 * Returns the current user's roadmap.
 */
const getUserRoadmap = async (userId) => {
    const roadmap = await Roadmap_1.default.findOne({ user: new mongoose_1.Types.ObjectId(userId) });
    if (!roadmap)
        throw new AppError_1.AppError('No roadmap found. Generate one first.', 404);
    return roadmap;
};
exports.getUserRoadmap = getUserRoadmap;
/**
 * Updates the status of a single node and recalculates progress.
 */
const updateNodeStatus = async (userId, nodeId, status) => {
    const roadmap = await Roadmap_1.default.findOne({ user: new mongoose_1.Types.ObjectId(userId) });
    if (!roadmap)
        throw new AppError_1.AppError('Roadmap not found', 404);
    const node = roadmap.nodes.id(nodeId);
    if (!node)
        throw new AppError_1.AppError('Roadmap node not found', 404);
    node.set({ status });
    // Recalculate progress
    const completed = roadmap.nodes.filter((n) => n.get('status') === 'Completed').length;
    roadmap.progress = Math.round((completed / roadmap.nodes.length) * 100);
    return roadmap.save();
};
exports.updateNodeStatus = updateNodeStatus;
/**
 * Deletes the user's roadmap (allows regeneration).
 */
const deleteUserRoadmap = async (userId) => {
    const roadmap = await Roadmap_1.default.findOneAndDelete({ user: new mongoose_1.Types.ObjectId(userId) });
    if (!roadmap)
        throw new AppError_1.AppError('No roadmap found', 404);
};
exports.deleteUserRoadmap = deleteUserRoadmap;
