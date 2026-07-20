"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNodeStatusSchema = exports.generateRoadmapSchema = void 0;
const zod_1 = require("zod");
exports.generateRoadmapSchema = zod_1.z.object({
    body: zod_1.z.object({
        targetRole: zod_1.z
            .string()
            .min(2, "Target role must be at least 2 characters"),
        currentSkills: zod_1.z
            .array(zod_1.z.string())
            .min(1, "Provide at least one current skill")
            .max(20, "Too many skills — maximum 20"),
    }),
});
exports.updateNodeStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["Pending", "InProgress", "Completed"]),
    }),
    params: zod_1.z.object({
        nodeId: zod_1.z.string().min(1, "Node ID is required"),
    }),
});
