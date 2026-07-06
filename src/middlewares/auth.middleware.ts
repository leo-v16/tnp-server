import type { Request, Response, NextFunction } from "express";
import { Jwt } from "../utils/jwt.util.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = (role_id_list: number[]) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const decode = Jwt.verify(req.body.auth_token);
        if (decode.email === req.body.email) {
            role_id_list.forEach((role_id)=> {
                if (decode.role_id === role_id) {
                    next();
                }
            });
            // throw new ApiError(401, `Unauthorized: ${decode.email}:${req.body.email} | ${decode.role_id}:${role_id}`);
        }
        throw new ApiError(401, `Unauthorized`);
    } catch (error) {
        next(error);
    }
}