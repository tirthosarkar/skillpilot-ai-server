import { z } from "zod";

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  duration: z.string().min(1, "Module duration is required"),
  content: z.string().min(1, "Module content is required"),
});

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    instructor: z.string().min(2, "Instructor name is required"),
    category: z.string().min(2, "Category is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    duration: z.string().min(2, "Duration is required"),
    thumbnail: z.string().url("Thumbnail must be a valid URL"),
    price: z.number().min(0, "Price cannot be negative").optional(),
    isPublished: z.boolean().optional(),
    curriculum: z.array(moduleSchema).optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: createCourseSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1, "Course ID is required"),
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>["body"];
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>["body"];