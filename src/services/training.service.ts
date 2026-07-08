import Role from "../models/role.model.js";
import Student from "../models/student.model.js";
import Training from "../models/training.model.js";
import User from "../models/user.model.js";
import type { ITraining, TrainingCreateData, TrainingCreateInput, TrainingEligibilityResult } from "../types/training.type.js";
import ApiError from "../utils/ApiError.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";

export const createTrainingService = async (input: TrainingCreateInput, actor: UserJwtPayload): Promise<ITraining> => {
    const existingOrganization = await User.findByEmail(actor.auth_email);
    if (!existingOrganization) {
        throw new ApiError(404, "Organization with this email does not exist");
    }

    const trainingData: TrainingCreateData = {
        creator_id: actor.auth_user_id,
        title: input.title,
        description: input.description ?? null,
        min_cgpa: input.min_cgpa ?? null,
        end_date: input.end_date ?? null,
        image_url: input.image_url ?? null,
        last_date_of_submission: input.last_date_of_submission ?? null,
        is_active: input.is_active ?? null,
    }
    const training = await Training.create(trainingData);
    if (!training) {
        throw new ApiError(500, "Failed to create training");
    }
    return training;
}

export const getTrainingService = async (actor: UserJwtPayload): Promise<ITraining[]> => {
    switch (actor.auth_role_id) {
        case Role.Student:
            const eligibleTraining = await Training.findEligibleById(actor.auth_user_id);
            if (!eligibleTraining) {
                throw new ApiError(500, "Could not find eligible trainings");
            }
            return eligibleTraining;
        case Role.Organization | Role.Coordinator | Role.SuperAdmin:
            const creatorTraining = await Training.findByCreatorId(actor.auth_user_id);
            if (!creatorTraining) {
                throw new ApiError(500, "Could not find trainings");
            }
            return creatorTraining;
        default:
            throw new ApiError(404, "Invalid Role");
    }
}

export const getOneTrainingService = async (trainind_id: number, actor: UserJwtPayload): Promise<ITraining> => {
    switch (actor.auth_role_id) {
        case Role.Student:
            const eligibleTraining = await Training.findOneEligibleById(trainind_id, actor.auth_user_id);
            if (!eligibleTraining) {
                throw new ApiError(500, "Could not find eligible training");
            }
            return eligibleTraining;
        case Role.Organization | Role.Coordinator | Role.SuperAdmin:
            const creatorTraining = await Training.findById(trainind_id);
            if (!creatorTraining) {
                throw new ApiError(500, "Could not find training");
            }
            return creatorTraining;
        default:
            throw new ApiError(404, "Invalid Role");
    }
}

export const checkStudentTrainingEligibilitySerivce = async (training_id: number, actor: UserJwtPayload): Promise<TrainingEligibilityResult> => {
    const training = await Training.findById(training_id);
    if (!training) {
        throw new ApiError(404, "Training does not exists");
    }
    if (!training.is_active) {
        return {
            isEligible: false,
            reason: "Training is not active"
        };
    }
    
    const student = await Student.findById(actor.auth_user_id);
    if (!student) {
        throw new ApiError(404, "Student does not exists");
    }


    if (training.min_cgpa !== null) {
        if (student.cgpa === null) {
            return {
                isEligible: false,
                reason: "Training requires minimum cgpa, but student has not set their cgpa"
            };
        }
    }

    return {
        isEligible: true,
        reason: "Student is Eligible"
    }
}
