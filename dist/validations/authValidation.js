"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(80, "Name cannot exceed 80 characters"),
        email: zod_1.z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),
        password: zod_1.z
            .string()
            .min(6, "Password must be at least 6 characters"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),
        password: zod_1.z
            .string()
            .min(1, "Password is required"),
    }),
});
