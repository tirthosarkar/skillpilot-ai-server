import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { ApiResponse, ValidationError } from '../types';

// ─── Shape handlers ───────────────────────────────────────────────────────────

const handleZodError = (err: ZodError): AppError => {
  const errors: ValidationError[] = err.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
  const message = errors.map((e) => `${e.field}: ${e.message}`).join('; ');
  const appErr = new AppError(message, 422);
  (appErr as any).errors = errors; // attach structured errors
  return appErr;
};

const handleCastError = (err: MongooseError.CastError): AppError =>
  new AppError(`Invalid value '${err.value}' for field '${err.path}'`, 400);

const handleDuplicateKey = (err: any): AppError => {
  const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
  const value = err.keyValue?.[field];
  return new AppError(
    `A record with ${field} '${value}' already exists`,
    409
  );
};

const handleValidationError = (err: MongooseError.ValidationError): AppError => {
  const messages = Object.values(err.errors)
    .map((e) => e.message)
    .join('; ');
  return new AppError(`Validation failed: ${messages}`, 400);
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token — please log in again', 401);

const handleJWTExpired = (): AppError =>
  new AppError('Your session has expired — please log in again', 401);

// ─── Global error handler ─────────────────────────────────────────────────────

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // Normalise known error shapes to AppError
  if (err instanceof ZodError) error = handleZodError(err);
  else if (err instanceof MongooseError.CastError) error = handleCastError(err);
  else if (err?.code === 11000) error = handleDuplicateKey(err);
  else if (err instanceof MongooseError.ValidationError) error = handleValidationError(err);
  else if (err instanceof JsonWebTokenError) error = handleJWTError();
  else if (err instanceof TokenExpiredError) error = handleJWTExpired();

  const statusCode: number =
    error instanceof AppError ? error.statusCode : (res.statusCode !== 200 ? res.statusCode : 500);

  const isProduction = process.env.NODE_ENV === 'production';

  // Log non-operational (unexpected) errors in full
  if (!(error instanceof AppError) || !error.isOperational) {
    console.error('[FATAL]', err);
  } else {
    console.warn(`[${statusCode}] ${error.message}`);
  }

  const body: ApiResponse = {
    success: false,
    message: error.message || 'An unexpected error occurred',
    ...((error as any).errors && { errors: (error as any).errors }),
    ...(!isProduction && { stack: error.stack ?? null }),
  };

  res.status(statusCode).json(body);
};
