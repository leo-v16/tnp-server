import TrainingApplication from "../models/training_application.model.js";
import type { ITrainingApplication, TrainingApplicationCreateInput } from "../types/training_application.type.js";
import ApiError from "../utils/ApiError.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";

export const createTrainingApplicationService = async (input: TrainingApplicationCreateInput, student: UserJwtPayload): Promise<ITrainingApplication> =>  {
    const existingTrainingApplication = await TrainingApplication.findById(student.auth_user_id, input.training_id);
    if (existingTrainingApplication) {
        throw new ApiError(409, "An application from this user already exists");
    }

    const newTrainingApplication = await TrainingApplication.create(input);
    if (!newTrainingApplication) {
        throw new ApiError(500, "Failed to create application");
    }

    return newTrainingApplication;
}