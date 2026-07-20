import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

/**
 * Sends a consistent JSON response across all controllers.
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  meta?: { count?: number; pagination?: PaginationMeta }
): void => {
  const body: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(meta?.count !== undefined && { count: meta.count }),
    ...(meta?.pagination && { pagination: meta.pagination }),
  };

  res.status(statusCode).json(body);
};
