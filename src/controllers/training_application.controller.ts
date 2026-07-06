import type { Request, Response, NextFunction } from "express";
import type { TrainingApplicationCreateInput } from "../types/training_application.type.js";
import { createTrainingApplicationService } from "../services/training_application.service.js";

export const createTrainingApplicationController = async (
    req: Request<{}, {}, TrainingApplicationCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newTrainingApplication = await createTrainingApplicationService(req.body);
        res.status(201).json({
            success: true,
            message: "Training Applcation created successfully",
            data: newTrainingApplication
        });
    } catch(error) {
        next(error);
    }
}