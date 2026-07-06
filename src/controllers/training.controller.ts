import type { Request, Response, NextFunction } from "express";
import type { trainingCreateInput } from "../types/training.type.js";
import { createTrainingService } from "../services/training.service.js";
import { success } from "zod";

export const createTrainingController = async (
    req: Request<{}, {}, trainingCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newTraining = await createTrainingService(req.body);
        res.json(201).json({
            success: true,
            message: "Successfully created training",
            data: newTraining
        });
    } catch (error) {
        next(error);
    }
}