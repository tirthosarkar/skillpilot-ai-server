"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("../utils/AppError");
// ─── Shape handlers ───────────────────────────────────────────────────────────
const handleZodError = (err) => {
    const errors = err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }));
    const message = errors.map((e) => `${e.field}: ${e.message}`).join('; ');
    const appErr = new AppError_1.AppError(message, 422);
    appErr.errors = errors; // attach structured errors
    return appErr;
};
const handleCastError = (err) => new AppError_1.AppError(`Invalid value '${err.value}' for field '${err.path}'`, 400);
const handleDuplicateKey = (err) => {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    const value = err.keyValue?.[field];
    return new AppError_1.AppError(`A record with ${field} '${value}' already exists`, 409);
};
const handleValidationError = (err) => {
    const messages = Object.values(err.errors)
        .map((e) => e.message)
        .join('; ');
    return new AppError_1.AppError(`Validation failed: ${messages}`, 400);
};
const handleJWTError = () => new AppError_1.AppError('Invalid token — please log in again', 401);
const handleJWTExpired = () => new AppError_1.AppError('Your session has expired — please log in again', 401);
// ─── Global error handler ─────────────────────────────────────────────────────
const errorHandler = (err, _req, res, _next) => {
    let error = err;
    // Normalise known error shapes to AppError
    if (err instanceof zod_1.ZodError)
        error = handleZodError(err);
    else if (err instanceof mongoose_1.Error.CastError)
        error = handleCastError(err);
    else if (err?.code === 11000)
        error = handleDuplicateKey(err);
    else if (err instanceof mongoose_1.Error.ValidationError)
        error = handleValidationError(err);
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError)
        error = handleJWTError();
    else if (err instanceof jsonwebtoken_1.TokenExpiredError)
        error = handleJWTExpired();
    const statusCode = error instanceof AppError_1.AppError ? error.statusCode : (res.statusCode !== 200 ? res.statusCode : 500);
    const isProduction = process.env.NODE_ENV === 'production';
    // Log non-operational (unexpected) errors in full
    if (!(error instanceof AppError_1.AppError) || !error.isOperational) {
        console.error('[FATAL]', err);
    }
    else {
        console.warn(`[${statusCode}] ${error.message}`);
    }
    const body = {
        success: false,
        message: error.message || 'An unexpected error occurred',
        ...(error.errors && { errors: error.errors }),
        ...(!isProduction && { stack: error.stack ?? null }),
    };
    res.status(statusCode).json(body);
};
exports.errorHandler = errorHandler;
