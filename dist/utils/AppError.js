"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * AppError — distinguishes operational (user-facing) errors from programmer bugs.
 *
 * Operational errors (isOperational = true) are safe to send to the client.
 * Non-operational errors bubble up as 500s with the message hidden in production.
 */
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        // Maintains proper stack trace (V8 only)
        Error.captureStackTrace(this, this.constructor);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Required when extending built-in classes in TypeScript
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
