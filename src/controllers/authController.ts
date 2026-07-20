import { Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/sendResponse';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../types';

// ─── POST /api/auth/register ─────────────────────────────────────────────────

export const registerUser = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const exists = await User.findOne({ email });
    if (exists) throw new AppError('An account with this email already exists', 409);

    const user = await User.create({ name, email, password });

    sendResponse(
      res,
      201,
      {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      },
      'Account created successfully'
    );
  }
);

// ─── POST /api/auth/login ────────────────────────────────────────────────────

export const loginUser = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    sendResponse(res, 200, {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  }
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    // req.user is already populated by protect middleware
    sendResponse(res, 200, req.user);
  }
);
