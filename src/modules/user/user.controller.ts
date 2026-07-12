import type { Request, Response, NextFunction } from "express";
import { registerUserService, loginUserService, getUserService, getOneUserService } from "./user.service.js";
import type { UserIdParamInput, UserLoginInput, UserRegisterInput } from "../user/user.type.js";
import Data from "../../utils/data.util.js";

export const registerUserController = async (
    req: Request<{}, {}, UserRegisterInput>, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const newUser = await registerUserService(req.body);
        return res.status(201).json({
            success: true,
            message: "User register successful",
            data: Data.sanitize(newUser)
        });
    } catch (error) {
        next(error);
    }
}

export const loginUserController = async (
    req: Request<{}, {}, UserLoginInput>, 
    res: Response, 
    next: NextFunction
) => {
    try {
        console.log("RUNNING");
        const loggedUser = await loginUserService(req.body);
        return res.status(200).json({
            success: true,
            message: "User login successful",
            data: Data.sanitize(loggedUser)
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
        const sanitizedUsers = userList.map((user) => Data.sanitize(user));
        res.status(200).json({
            success: true,
            message: "All user list provided",
            data: sanitizedUsers
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
            data: Data.sanitize(user)
        });
    } catch(error) {
        next(error);
    }
}