"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
const moduleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Module title is required"),
    duration: zod_1.z.string().min(1, "Module duration is required"),
    content: zod_1.z.string().min(1, "Module content is required"),
});
exports.createCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
        description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
        instructor: zod_1.z.string().min(2, "Instructor name is required"),
        category: zod_1.z.string().min(2, "Category is required"),
        level: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]),
        duration: zod_1.z.string().min(2, "Duration is required"),
        thumbnail: zod_1.z.string().url("Thumbnail must be a valid URL"),
        price: zod_1.z.number().min(0, "Price cannot be negative").optional(),
        isPublished: zod_1.z.boolean().optional(),
        curriculum: zod_1.z.array(moduleSchema).optional(),
    }),
});
exports.updateCourseSchema = zod_1.z.object({
    body: exports.createCourseSchema.shape.body.partial(),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Course ID is required"),
    }),
});
