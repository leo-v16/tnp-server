import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";
import type { IOrganization, OrganizationRegisterInput, OrganizationStatusInput, OrganizationUpdateData } from "../types/organization.type.js";
import PasswordManager from "../utils/password.util.js";
import ApiError from "../utils/ApiError.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";

export const registerOrganizationService = async (input: OrganizationRegisterInput, actor: UserJwtPayload): Promise<IOrganization> => {
    const existingUser = await User.findByEmail(input.email);
    if (existingUser) {
        throw new ApiError(409, "Organization with this email already exists");
    }

    input.password = await PasswordManager.hashPassword(input.password);
    const newOganization = await Organization.create(input);

    if (!newOganization) {
        throw new Error;
    }

    return newOganization;
}

export const approveOrganizationService = async (input: OrganizationStatusInput, actor: UserJwtPayload): Promise<IOrganization> => {
    const existingUser = await User.findByEmail(actor.auth_email);
    if (!existingUser) {
        throw new ApiError(404, "User with this email does not exist");
    } 

    const existingOrganization = await User.findByEmail(input.email);
    if (!existingOrganization) {
        throw new ApiError(404, "Organization with this email does not exist");
    }

    const organizationData: OrganizationUpdateData = {
        approval_id: 1
    }
    const organization = await Organization.update(existingOrganization.user_id, organizationData);
    if (!organization) {
        throw new ApiError(500, "Failed to approve(update) organization");
    }

    return organization;
}

export const rejectOrganizationService = async (input: OrganizationStatusInput, actor: UserJwtPayload): Promise<IOrganization> => {
    const existingUser = await User.findByEmail(actor.auth_email);
    if (!existingUser) {
        throw new ApiError(404, "User with this email does not exist");
    } 

    const existingOrganization = await User.findByEmail(input.email);
    if (!existingOrganization) {
        throw new ApiError(404, "Organization with this email does not exist");
    }

    const organizationData: OrganizationUpdateData = {
        approval_id: 2
    }
    const organization = await Organization.update(existingOrganization.user_id, organizationData);
    if (!organization) {
        throw new ApiError(500, "Failed to approve(update) organization");
    }

    return organization;
}

export const  getApprovedOrganizationService = async (): Promise<IOrganization[]> => {
    const organizationList = await Organization.findApproved();
    if (!organizationList) {
        throw new ApiError(500, "Could not fetch organization list");
    }
    return organizationList;
}

export const  getRejectedOrganizationService = async (): Promise<IOrganization[]> => {
    const organizationList = await Organization.findRejected();
    if (!organizationList) {
        throw new ApiError(500, "Could not fetch organization list");
    }
    return organizationList;
}

export const  getPendingOrganizationService = async (): Promise<IOrganization[]> => {
    const organizationList = await Organization.findPending();
    if (!organizationList) {
        throw new ApiError(500, "Could not fetch organization list");
    }
    return organizationList;
}

export const  getOneOrganizationService = async (organization_id: number): Promise<IOrganization> => {
    const organization = await Organization.findById(organization_id);
    if (!organization) {
        throw new ApiError(500, "Could not fetch organization list");
    }
    return organization;
}
