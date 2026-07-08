import type { Request, Response, NextFunction } from "express";
import { registerUserService, loginUserService, getUserService, getOneUserService } from "../services/user.service.js";
import type { UserIdParamInput, UserLoginInput, UserRegisterInput } from "../types/user.type.js";

export const registerUserController = async (req: Request<{}, {}, UserRegisterInput>, res: Response, next: NextFunction) => {
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

export const loginUserController = async (req: Request<{}, {}, UserLoginInput>, res: Response, next: NextFunction) => {
    try {
        const loggedUser = await loginUserService(req.body);
        return res.status(200).json({
            success: true,
            message: "User login successful",
            data: {...loggedUser, password: undefined}
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
            data: {...userList, password: undefined}
        });
    } catch(error) {
        next(error);
    }
}

export const getOneUserController = async (
    req: Request<UserIdParamInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await getOneUserService(req.params as UserIdParamInput);
        res.status(200).json({
            success: true,
            message: "User details provided",
            data: {...user, password: undefined}
        });
    } catch(error) {
        next(error);
    }
}