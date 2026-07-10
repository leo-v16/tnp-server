import { escapeId } from "mysql2";
import User from "../models/user.model.js";
import type { IUser, UserIdParamInput, UserLoginInput, UserRegisterInput } from "../types/user.type.js";
import ApiError from "../utils/ApiError.js";
import PasswordManager from "../utils/password.util.js";
import { Jwt, type UserJwtPayload } from "../utils/jwt.util.js";
import Role from "../models/role.model.js";
import Student from "../models/student.model.js";
import type { IStudent } from "../types/student.type.js";
import type { IOrganization } from "../types/organization.type.js";
import Organization from "../models/organization.model.js";

export const registerUserService = async (input: UserRegisterInput): Promise<IUser> => {
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

export const loginUserService = async (input: UserLoginInput): Promise<IUser & (IStudent | IOrganization)> => {
    const existingUser = await User.findByEmail(input.email);
    if (!existingUser || existingUser.role_id !== input.role_id) {
        throw new ApiError(401, "Invalid email, password, or role");
    }

    if (input.role_id === Role.Organization) {
        const organization = await Organization.findById(existingUser.user_id);
        if (!organization || organization.approval_id !== 1) {
            throw new ApiError(403, "Organization account is pending approval or has been rejected");
        }
    }

    const verified = await PasswordManager.verifyPassword(input.password, existingUser.password);
    if (!verified) {
        throw new ApiError(401, "Invalid email, password, or role");
    }

    const payload: UserJwtPayload = {
        auth_user_id: existingUser.user_id,
        auth_email: existingUser.email,
        auth_role_id: existingUser.role_id,
    } 
    const auth_token = Jwt.sign(payload);

    let extradata: IStudent | IOrganization | null = null;
    switch (existingUser.role_id) {
        case Role.Student:
            extradata = await Student.findById(existingUser.user_id);
            break;
        case Role.Organization:
            extradata = await Organization.findById(existingUser.user_id);
            break;
    }

    return {...existingUser, auth_token: auth_token, ...extradata} as IUser & (IStudent | IOrganization);
}

export const getUserService = async (): Promise<IUser[]> => {
    const userList = await User.findAll();
    if (!userList) {
        throw new ApiError(500, "Unable to get user list");
    }

    return userList;
}

export const getOneUserService = async (input: UserIdParamInput): Promise<IUser & (IStudent | IOrganization)> => {
    console.log(input)
    const user = await User.findById(input.user_id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    switch (user.role_id) {
        case Role.Student:
            const student = await Student.findById(user.user_id);
            return {...user, ...student} as IUser & IStudent;
        case Role.Organization:
            const organization = await Organization.findById(user.user_id);
            return {...user, ...organization} as IUser & IOrganization;
        default:
            throw new ApiError(400, "Unknown Role, Can't fetch admin information");
    }
}