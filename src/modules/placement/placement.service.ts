import Role from "../../models/role.model.js";
import Student from "../student/student.model.js";
import User from "../models/user.model.js";
import Organization from "../organization/organization.model.js";
import ApiError from "../../utils/ApiError.js";
import type { UserJwtPayload } from "../../utils/jwt.util.js";
import type { IPlacement, PlacementCreateData, PlacementCreateInput, PlacementEligibilityResult } from "../../types/placement.type.js";
import Placement from "../models/placement.model.js";

export const createPlacementService = async (input: PlacementCreateInput, actor: UserJwtPayload): Promise<IPlacement> => {
    const creator = await User.findByEmail(actor.auth_email);
    if (!creator) {
        throw new ApiError(404, "User does not exist");
    }
    if (actor.auth_role_id === Role.Organization) {
        const org = await Organization.findById(actor.auth_user_id);
        if (!org || org.approval_id !== 1) {
            throw new ApiError(403, "Organization account is not approved or has been rejected");
        }
    }

    const placementData: PlacementCreateData = {
        creator_id: actor.auth_user_id,
        title: input.title,
        description: input.description ?? null,
        min_cgpa: input.min_cgpa ?? null,
        image_url: input.image_url ?? null,
        last_date_of_submission: input.last_date_of_submission ?? null,
        is_active: input.is_active ?? null,
    }
    const placement = await Placement.create(placementData);
    if (!placement) {
        throw new ApiError(500, "Failed to create placement");
    }
    return placement;
}

export const getPlacementService = async (actor: UserJwtPayload): Promise<IPlacement[]> => {
    switch (actor.auth_role_id) {
        case Role.Student:
            const eligiblePlacement = await Placement.findEligibleById(actor.auth_user_id);
            if (!eligiblePlacement) {
                throw new ApiError(500, "Could not find eligible placements");
            }
            return eligiblePlacement;
        case Role.Organization:
        case Role.Coordinator:
        case Role.SuperAdmin:
            const creatorPlacement = await Placement.findByCreatorId(actor.auth_user_id);
            if (!creatorPlacement) {
                throw new ApiError(500, "Could not find placements");
            }
            return creatorPlacement;
        default:
            throw new ApiError(404, "Invalid Role");
    }
}

export const getOnePlacementService = async (placement_id: number, actor: UserJwtPayload): Promise<IPlacement> => {
    switch (actor.auth_role_id) {
        case Role.Student:
            const eligiblePlacement = await Placement.findOneEligibleById(placement_id, actor.auth_user_id);
            if (!eligiblePlacement) {
                throw new ApiError(500, "Could not find eligible placement");
            }
            return eligiblePlacement;
        case Role.Organization:
        case Role.Coordinator:
        case Role.SuperAdmin:
            const creatorPlacement = await Placement.findById(placement_id);
            if (!creatorPlacement) {
                throw new ApiError(500, "Could not find placement");
            }
            return creatorPlacement;
        default:
            throw new ApiError(404, "Invalid Role");
    }
}

export const checkStudentPlacementEligibilityService = async (placement_id: number, actor: UserJwtPayload): Promise<PlacementEligibilityResult> => {
    const placement = await Placement.findById(placement_id);
    if (!placement) {
        throw new ApiError(404, "Placement does not exist");
    }
    if (!placement.is_active) {
        return {
            isEligible: false,
            reason: "Placement is not active"
        };
    }
    
    const student = await Student.findById(actor.auth_user_id);
    if (!student) {
        throw new ApiError(404, "Student does not exist");
    }


    if (placement.min_cgpa !== null) {
        if (student.cgpa === null) {
            return {
                isEligible: false,
                reason: "Placement requires minimum cgpa, but student has not set their cgpa"
            };
        }
    }

    return {
        isEligible: true,
        reason: "Student is Eligible"
    }
}
