import type { Request, Response, NextFunction } from "express";
import { Jwt } from "../utils/jwt.util.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = (role_id: number) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const decode = Jwt.verify(req.body.auth_token);
        if (decode.email !== req.body.email || decode.role_id !== role_id) {
            // throw new ApiError(401, `Unauthorized: ${decode.email}:${req.body.email} | ${decode.role_id}:${role_id}`);
            throw new ApiError(401, `Unauthorized`);
        }
        next();
    } catch (error) {
        next(error);
    }
}