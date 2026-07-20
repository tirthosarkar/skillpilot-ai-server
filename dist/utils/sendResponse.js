"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
/**
 * Sends a consistent JSON response across all controllers.
 */
const sendResponse = (res, statusCode, data, message, meta) => {
    const body = {
        success: true,
        ...(message && { message }),
        ...(data !== undefined && { data }),
        ...(meta?.count !== undefined && { count: meta.count }),
        ...(meta?.pagination && { pagination: meta.pagination }),
    };
    res.status(statusCode).json(body);
};
exports.sendResponse = sendResponse;
