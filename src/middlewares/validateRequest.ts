import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse, ValidationError } from '../types';

/**
 * Validates req.body, req.query, and req.params against the provided Zod schema.
 * Returns a structured 422 with per-field error details on failure.
 */
export const validate = (schema: ZodSchema<unknown>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationError[] = error.issues.map((issue) => ({
          field: issue.path.slice(1).join('.'), // strip leading 'body'/'query'/'params'
          message: issue.message,
        }));

        const body: ApiResponse = {
          success: false,
          message: 'Validation failed',
          errors,
        };

        res.status(422).json(body);
        return;
      }
      next(error);
    }
  };
};
