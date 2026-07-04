import { escapeId } from "mysql2";
import User from "../models/user.model.js";
import type { IUser, userLoginInput, userRegisterInput } from "../types/user.type.js";
import ApiError from "../utils/ApiError.js";
import PasswordManager from "../utils/password.util.js";

export const registerUserService = async (input: userRegisterInput): Promise<IUser> => {
    const existingUser = await User.findByEmail(input.email);
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    input.password = await PasswordManager.hashPassword(input.password);
    const newUser = await User.create(input);

    if (!newUser) {
        throw new Error;
    }

    return newUser;
}

export const loginUserService = async (input: userLoginInput): Promise<IUser> => {
    const existingUser = await User.findByEmail(input.email);
    if (!existingUser) {
        throw new ApiError(404, "User with this email does not exist");
    }

    const verfied = await PasswordManager.verifyPassword(input.password, existingUser.password);
    if (!verfied) {
        throw new ApiError(401, "Incorrect password");
    }

    return existingUser;
}