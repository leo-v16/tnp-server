import type { Request, Response, NextFunction } from "express";
import type { TrainingApplicationCreateInput, trainingApplicationIdParamInput } from "../types/training_application.type.js";
import {approveTrainingApplicationService, createTrainingApplicationService, viewTrainingApplicationService } from "../services/training_application.service.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";

export const createTrainingApplicationController = async (
    req: Request<{}, {}, TrainingApplicationCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newTrainingApplication = await createTrainingApplicationService(req.body, req.user as UserJwtPayload);
        res.status(201).json({
            success: true,
            message: "Training Applcation created successfully",
            data: newTrainingApplication
        });
    } catch(error) {
        next(error);
    }
}

export const viewTrainingApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const appliedTrainings = await viewTrainingApplicationService(req.user as UserJwtPayload);

        res.status(200).json({
            success: true,
            message: "Training Application fetch successfull",
            data: appliedTrainings
        });
    } catch (error) {
        next(error);
    }
}

export const approveTrainingApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const params = (req.params as trainingApplicationIdParamInput);
        const {student_id, training_id} = params;
        const approvedTraining = await approveTrainingApplicationService(student_id, training_id, req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: "Training Application approved successfull",
            data: approvedTraining
        });
    } catch (error) {
        next(error);
    }
}