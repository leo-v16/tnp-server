import { type ZodType, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            errors: (error instanceof ZodError)? error.issues: "Failed to validate request",
        });
    }
}