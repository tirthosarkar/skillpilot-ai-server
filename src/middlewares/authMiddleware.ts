import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

/**
 * Verifies the Bearer token and attaches the user document to req.user.
 * Throws 401 AppError if token is missing, invalid, or user no longer exists.
 */
export const protect = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Not authorized — no token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'changeme_in_production'
    ) as { id: string };

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists', 401);
    }

    req.user = user;
    next();
  }
);

/**
 * Role-based access control — must be used after protect.
 * Usage: authorize('admin') or authorize('admin', 'moderator')
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user?.role ?? 'unknown'}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
