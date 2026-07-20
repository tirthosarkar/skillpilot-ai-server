import { z } from "zod";

export const resumeAnalyzeSchema = z.object({
  body: z.object({
    resumeText: z
      .string()
      .min(50, "Resume text is too short (minimum 50 characters)"),

    targetRole: z
      .string()
      .min(2, "Target role is required"),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    message: z
      .string()
      .min(1, "Message cannot be empty")
      .max(2000, "Message cannot exceed 2000 characters"),

    contextMemory: z.string().optional(),

    chatId: z.string().optional(),
  }),
});

export const recommendationsSchema = z.object({
  body: z.object({
    userContext: z
      .object({
        targetRole: z.string().min(2),
        currentSkills: z
          .array(z.string())
          .min(1, "Provide at least one skill"),
        experienceLevel: z.enum([
          "Junior",
          "Intermediate",
          "Senior",
        ]),
      })
      .optional(),
  }),
});

export type ResumeAnalyzeInput =
  z.infer<typeof resumeAnalyzeSchema>["body"];

export type ChatInput =
  z.infer<typeof chatSchema>["body"];