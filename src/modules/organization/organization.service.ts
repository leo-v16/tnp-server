import Organization from "./organization.model.js";
import PasswordManager from "../../utils/password.util.js";
import ApiError from "../../utils/ApiError.js";
import type { UserJwtPayload } from "../../utils/jwt.util.js";
import type { IOrganization, OrganizationRegisterInput, OrganizationUpdateData } from "./organization.type.js";
import User from "../user/user.model.js";

export const registerOrganizationService = async (input: OrganizationRegisterInput, actor: UserJwtPayload) => {
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

export const updateOrganizationStatusService = async (organization_id: number, approval_id: number, actor: UserJwtPayload) => {
    const existingUser = await User.findByEmail(actor.auth_email);
    if (!existingUser) {
        throw new ApiError(404, "User does not exist");
    } 

    const existingOrganization = await Organization.findById(organization_id);
    if (!existingOrganization) {
        throw new ApiError(404, "Organization does not exist");
    }

    const organizationData: OrganizationUpdateData = {
        approval_id
    }
    const organization = await Organization.update(organization_id, organizationData);
    if (!organization) {
        throw new ApiError(500, "Failed to update organization status");
    }

    return organization;
}

export const getOrganizationsService = async (status?: "approved" | "pending" | "rejected") => {
    let organizationList = null;
    if (status === "pending") {
        organizationList = await Organization.findPending();
    } else if (status === "rejected") {
        organizationList = await Organization.findRejected();
    } else {
        organizationList = await Organization.findApproved();
    }

    if (!organizationList) {
        throw new ApiError(500, "Could not fetch organization list");
    }
    return organizationList;
}

export const getOneOrganizationService = async (organization_id: number) => {
    const organization = await Organization.findById(organization_id);
    if (!organization) {
        throw new ApiError(404, "Organization not found");
    }
    return organization;
}
