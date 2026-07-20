"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production';
/**
 * Generates a signed access token (30-day expiry).
 */
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};
exports.generateToken = generateToken;
/**
 * Generates a signed short-lived token (7-day expiry) — can be used for
 * refresh token flows without full session infrastructure.
 */
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
