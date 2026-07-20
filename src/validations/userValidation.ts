import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name cannot exceed 80 characters')
      .optional(),
    email: z.string().email('Invalid email address').optional(),
  }),
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    email: z.string().email().optional(),
    role: z.enum(['user', 'admin']).optional(),
  }),
  params: z.object({ id: z.string().min(1, 'User ID is required') }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>['body'];
