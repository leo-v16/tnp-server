import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";
import type { organizationRegisterInput } from "../types/organization.type.js";
import PasswordManager from "../utils/password.util.js";
import ApiError from "../utils/ApiError.js";

export const registerOrganizationService = async (input: organizationRegisterInput) => {
    const existingUser = await User.findByEmail(input.email);
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    input.password = await PasswordManager.hashPassword(input.password);
    const newOganization = await Organization.create(input);

    if (!newOganization) {
        throw new Error;
    }

    return newOganization;
}