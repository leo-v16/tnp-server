import type { Request, Response, NextFunction } from "express";
import { registerUserService, loginUserService } from "../services/user.service.js";
import type { userLoginInput, userRegisterInput } from "../types/user.type.js";

export const registerUserController = async (req: Request<{}, {}, userRegisterInput>, res: Response, next: NextFunction) => {
    try {
        const newUser = await registerUserService(req.body);
        return res.status(201).json({
            success: true,
            message: "User register successful",
            data: newUser
        });
    } catch (error) {
        next(error);
    }
}

export const loginUserController = async (req: Request<{}, {}, userLoginInput>, res: Response, next: NextFunction) => {
    try {
        const loggedUser = await loginUserService(req.body);
        return res.status(200).json({
            success: true,
            message: "User login successful",
            data: loggedUser
        });
    } catch (error) {
        next(error);
    }
}

export const getUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userList = await getUserService();
        res.status(200).json({
            success: true,
            message: "All user list provided",
            data: userList
        });
    } catch(error) {
        next(error);
    }
}