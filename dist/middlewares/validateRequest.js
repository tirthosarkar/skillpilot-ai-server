"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
/**
 * Validates req.body, req.query, and req.params against the provided Zod schema.
 * Returns a structured 422 with per-field error details on failure.
 */
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.slice(1).join('.'), // strip leading 'body'/'query'/'params'
                    message: issue.message,
                }));
                const body = {
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
exports.validate = validate;
