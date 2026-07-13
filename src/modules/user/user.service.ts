import ApiError from "../../utils/ApiError.js";
import PasswordManager from "../../utils/password.util.js";
import { Jwt, type UserJwtPayload } from "../../utils/jwt.util.js";
import Student from "../student/student.model.js";
import type { IStudent } from "../student/student.type.js";
import Organization from "../organization/organization.model.js";
import type { IUser, UserIdParamInput, UserLoginInput, UserRegisterInput } from "./user.type.js";
import User from "./user.model.js";
import type { IOrganization } from "../organization/organization.type.js";
import Role from "../role/role.model.js";

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

export const loginUserService = async (input: UserLoginInput) => {
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

    let first_login = false;
    if (existingUser.last_login === null) {
        first_login = true;
    }
    await User.updateLastLogin(existingUser.user_id);

    return {...existingUser, ...extradata, first_login, auth_token: auth_token};
}

export const getUserService = async (): Promise<IUser[]> => {
    const userList = await User.findAll();
    if (!userList) {
        throw new ApiError(500, "Unable to get user list");
    }

    return userList;
}

export const getOneUserService = async (input: UserIdParamInput) => {
    console.log(input)
    const user = await User.findById(input.user_id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // const {password, ...san_user} = user;
    switch (user.role_id) {
        case Role.Student:
            const student = await Student.findById(user.user_id);
            return {...user, ...student};
        case Role.Organization:
            const organization = await Organization.findById(user.user_id);
            return {...user, ...organization};
        default:
            throw new ApiError(400, "Unknown Role, Can't fetch admin information");
    }
}