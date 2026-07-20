"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateUserSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(80, 'Name cannot exceed 80 characters')
            .optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
    }),
});
exports.adminUpdateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(80).optional(),
        email: zod_1.z.string().email().optional(),
        role: zod_1.z.enum(['user', 'admin']).optional(),
    }),
    params: zod_1.z.object({ id: zod_1.z.string().min(1, 'User ID is required') }),
});
