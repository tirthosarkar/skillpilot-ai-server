import { Response, NextFunction } from 'express';
import * as aiService from '../services/aiService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/sendResponse';
import { AuthRequest, UserContext } from '../types';

// ─── POST /api/ai/recommendations ────────────────────────────────────────────

export const getRecommendations = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userContext: UserContext = req.body.userContext ?? {
      targetRole: 'Senior Frontend Engineer',
      currentSkills: ['React', 'JavaScript', 'CSS'],
      experienceLevel: 'Intermediate',
    };

    const data = await aiService.generateAndSaveRecommendations(
      req.user!.id,
      userContext
    );

    sendResponse(res, 200, data, `${data.length} recommendations generated`);
  }
);

// ─── POST /api/ai/resume-analyze ─────────────────────────────────────────────

export const analyzeResume = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { resumeText, targetRole } = req.body as {
      resumeText: string;
      targetRole: string;
    };

    const data = await aiService.runResumeAnalysis(
      req.user!.id,
      resumeText,
      targetRole
    );

    sendResponse(res, 200, data, 'Resume analysis complete');
  }
);

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────

export const chat = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { message, contextMemory, chatId } = req.body as {
      message: string;
      contextMemory?: string;
      chatId?: string;
    };

    const session = await aiService.handleChat(
      req.user!.id,
      message,
      contextMemory ?? `Target Role: ${req.user?.name}'s goal`,
      chatId
    );

    sendResponse(res, 200, session);
  }
);

// ─── GET /api/ai/history ─────────────────────────────────────────────────────

export const getChatHistory = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const sessions = await aiService.getChatHistory(req.user!.id);
    sendResponse(res, 200, sessions, undefined, { count: sessions.length });
  }
);
