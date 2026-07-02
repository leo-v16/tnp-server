import User from "../models/user.model.js";
import type { IUser, userRegisterInput } from "../types/user.type.js";

export const createUser = async (input: userRegisterInput): Promise<IUser> => {
    const existingUser = await User.findByEmail(input.email);
    if (existingUser) {
        throw new Error;
    }

    const newUser = await User.create(input);

    if (!newUser) {
        throw new Error;
    }

    return newUser;
}