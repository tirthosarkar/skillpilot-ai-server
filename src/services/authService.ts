import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production';

/**
 * Generates a signed access token (30-day expiry).
 */
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Generates a signed short-lived token (7-day expiry) — can be used for
 * refresh token flows without full session infrastructure.
 */
export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};
