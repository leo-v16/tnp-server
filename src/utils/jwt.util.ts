import jwt from "jsonwebtoken";
import "dotenv/config"
import ApiError from "./ApiError.js";

export interface UserJwtPayload extends jwt.JwtPayload {
    email: string,
    role_id: number
};

export class Jwt {
    static sign(payload: UserJwtPayload): string {
        return jwt.sign(payload, process.env.JWT_TOKEN || "", {expiresIn: "1h"});
    }

    static verify(token: string): UserJwtPayload {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || "");
        if (typeof decoded === "string") {
            throw new ApiError(500, "Format of decoed jwt token is broken(string)");
        }
        return decoded as UserJwtPayload; 
    }
};