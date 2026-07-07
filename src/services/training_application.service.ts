import Role from "../models/role.model.js";
import TrainingApplication from "../models/training_application.model.js";
import User from "../models/user.model.js";
import type { ITrainingApplication, TrainingApplicationCreateData, TrainingApplicationCreateInput } from "../types/training_application.type.js";
import ApiError from "../utils/ApiError.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";
import { checkStudentTrainingEligibilitySerivce } from "./training.service.js";

export const createTrainingApplicationService = async (input: TrainingApplicationCreateInput, student: UserJwtPayload): Promise<ITrainingApplication> =>  {
    const existingTrainingApplication = await TrainingApplication.findById(student.auth_user_id, input.training_id);
    if (existingTrainingApplication) {
        throw new ApiError(409, "An application from this user already exists");
    }
    const trainingApplicationData: TrainingApplicationCreateData = {
        student_id: student.auth_user_id,
        training_id: input.training_id
    }

    const eligibilty = await checkStudentTrainingEligibilitySerivce(trainingApplicationData.training_id, student);
    if (eligibilty.isEligible === false) {
        throw new ApiError(400, eligibilty.reason);
    }

    const newTrainingApplication = await TrainingApplication.create(trainingApplicationData);
    if (!newTrainingApplication) {
        throw new ApiError(500, "Failed to create application");
    }

    return newTrainingApplication;
}

export const viewTrainingApplicationService = async (user: UserJwtPayload): Promise<ITrainingApplication[]> => {
    const currentUser = await User.findByEmail(user.auth_email);
    if (!currentUser) {
        throw new ApiError(404, "User with this email does not exist");
    }

    let trainingApplication: ITrainingApplication[] | null = null;
    switch (user.auth_role_id) {
        case Role.Student:
            trainingApplication = await TrainingApplication.findByStudentId(user.auth_user_id);
            break;
        case Role.Organization | Role.Coordinator | Role.Organization:
            trainingApplication = await TrainingApplication.findByCreatorId(user.auth_user_id);
            break;
    }

    if (!trainingApplication) {
        throw new ApiError(500, `Could not fetch Training Application Data`);
    }

    return trainingApplication;
}  