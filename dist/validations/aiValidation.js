"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationsSchema = exports.chatSchema = exports.resumeAnalyzeSchema = void 0;
const zod_1 = require("zod");
exports.resumeAnalyzeSchema = zod_1.z.object({
    body: zod_1.z.object({
        resumeText: zod_1.z
            .string()
            .min(50, "Resume text is too short (minimum 50 characters)"),
        targetRole: zod_1.z
            .string()
            .min(2, "Target role is required"),
    }),
});
exports.chatSchema = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z
            .string()
            .min(1, "Message cannot be empty")
            .max(2000, "Message cannot exceed 2000 characters"),
        contextMemory: zod_1.z.string().optional(),
        chatId: zod_1.z.string().optional(),
    }),
});
exports.recommendationsSchema = zod_1.z.object({
    body: zod_1.z.object({
        userContext: zod_1.z
            .object({
            targetRole: zod_1.z.string().min(2),
            currentSkills: zod_1.z
                .array(zod_1.z.string())
                .min(1, "Provide at least one skill"),
            experienceLevel: zod_1.z.enum([
                "Junior",
                "Intermediate",
                "Senior",
            ]),
        })
            .optional(),
    }),
});
