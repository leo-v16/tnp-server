import Organization from "../models/organization.model.js";
import Training from "../models/training.model.js";
import User from "../models/user.model.js";
import type { ITraining, trainingCreateData, trainingCreateInput } from "../types/training.type.js";
import ApiError from "../utils/ApiError.js";

export const createTrainingService = async (input: trainingCreateInput): Promise<ITraining> => {
    const existingOrganization = await User.findByEmail(input.email);
    if (!existingOrganization) {
        throw new ApiError(404, "Organization with this email does not exist");
    }

    const trainingData: trainingCreateData = {
        creator_id: existingOrganization.user_id,
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