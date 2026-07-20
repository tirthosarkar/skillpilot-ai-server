import { z } from "zod";

export const generateRoadmapSchema = z.object({
  body: z.object({
    targetRole: z
      .string()
      .min(2, "Target role must be at least 2 characters"),

    currentSkills: z
      .array(z.string())
      .min(1, "Provide at least one current skill")
      .max(20, "Too many skills — maximum 20"),
  }),
});

export const updateNodeStatusSchema = z.object({
  body: z.object({
    status: z.enum(["Pending", "InProgress", "Completed"]),
  }),

  params: z.object({
    nodeId: z.string().min(1, "Node ID is required"),
  }),
});

export type GenerateRoadmapInput =
  z.infer<typeof generateRoadmapSchema>["body"];

export type UpdateNodeStatusInput =
  z.infer<typeof updateNodeStatusSchema>["body"];