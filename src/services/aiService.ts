import {
  generateCareerRecommendations,
  analyzeResumeContent,
  chatWithAI,
  generateRoadmapNodes,
} from './geminiService';
import Recommendation from '../models/Recommendation';
import ResumeAnalysis from '../models/ResumeAnalysis';
import AIChat from '../models/AIChat';
import Roadmap from '../models/Roadmap';
import { UserContext, GeminiRoadmapNode } from '../types';
import { AppError } from '../utils/AppError';
import { Types } from 'mongoose';

/**
 * Generates AI recommendations, persists to DB, and returns saved docs.
 */
export const generateAndSaveRecommendations = async (
  userId: string,
  userContext: UserContext
) => {
  const result = await generateCareerRecommendations(userContext);

  return Promise.all(
    result.recommendations.map((rec) =>
      Recommendation.create({
        user: new Types.ObjectId(userId),
        title: rec.title,
        reason: rec.reason,
        type: rec.type,
      })
    )
  );
};

/**
 * Runs ATS resume analysis, persists, and returns saved doc.
 */
export const runResumeAnalysis = async (
  userId: string,
  resumeText: string,
  targetRole: string
) => {
  const analysis = await analyzeResumeContent(resumeText, targetRole);

  return ResumeAnalysis.create({
    user: new Types.ObjectId(userId),
    targetRole,
    atsScore: analysis.atsScore,
    missingSkills: analysis.missingSkills,
    suggestions: analysis.suggestions,
  });
};

/**
 * Sends a message to AI, persists the chat session, returns session.
 */
export const handleChat = async (
  userId: string,
  message: string,
  contextMemory: string,
  chatId?: string
) => {
  const reply = await chatWithAI(message, contextMemory);

  // Append to existing session
  if (chatId) {
    const session = await AIChat.findById(chatId);
    if (session && session.user.toString() === userId) {
      session.messages.push(
        { role: 'user', content: message, timestamp: new Date() } as any,
        { role: 'ai', content: reply as string, timestamp: new Date() } as any
      );
      return session.save();
    }
  }

  // Create new session
  return AIChat.create({
    user: new Types.ObjectId(userId),
    title: `${message.substring(0, 40)}...`,
    messages: [
      { role: 'user', content: message },
      { role: 'ai', content: reply },
    ],
  });
};

/**
 * Returns all chat sessions for a user (latest first).
 */
export const getChatHistory = async (userId: string) => {
  return AIChat.find({ user: new Types.ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .select('title updatedAt createdAt');
};

/**
 * Generates a roadmap via Gemini and persists it for the user.
 */
export const generateAndSaveRoadmap = async (
  userId: string,
  targetRole: string,
  currentSkills: string[]
) => {
  // Check if one already exists
  const existing = await Roadmap.findOne({ user: new Types.ObjectId(userId) });
  if (existing) {
    throw new AppError(
      'Roadmap already exists. Delete your current roadmap to generate a new one.',
      409
    );
  }

  const result = await generateRoadmapNodes(targetRole, currentSkills);

  const nodes = result.nodes.map((n: GeminiRoadmapNode) => ({
    title: n.title,
    type: n.type,
    status: 'Pending' as const,
  }));

  return Roadmap.create({
    user: new Types.ObjectId(userId),
    targetRole,
    nodes,
    progress: 0,
  });
};

/**
 * Returns the current user's roadmap.
 */
export const getUserRoadmap = async (userId: string) => {
  const roadmap = await Roadmap.findOne({ user: new Types.ObjectId(userId) });
  if (!roadmap) throw new AppError('No roadmap found. Generate one first.', 404);
  return roadmap;
};

/**
 * Updates the status of a single node and recalculates progress.
 */
export const updateNodeStatus = async (
  userId: string,
  nodeId: string,
  status: 'Pending' | 'InProgress' | 'Completed'
) => {
  const roadmap = await Roadmap.findOne({ user: new Types.ObjectId(userId) });
  if (!roadmap) throw new AppError('Roadmap not found', 404);

  const node = roadmap.nodes.id(nodeId);
  if (!node) throw new AppError('Roadmap node not found', 404);

  node.set({ status });

  // Recalculate progress
  const completed = roadmap.nodes.filter((n) => n.get('status') === 'Completed').length;
  roadmap.progress = Math.round((completed / roadmap.nodes.length) * 100);

  return roadmap.save();
};

/**
 * Deletes the user's roadmap (allows regeneration).
 */
export const deleteUserRoadmap = async (userId: string) => {
  const roadmap = await Roadmap.findOneAndDelete({ user: new Types.ObjectId(userId) });
  if (!roadmap) throw new AppError('No roadmap found', 404);
};
