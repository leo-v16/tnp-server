import type { Request, Response, NextFunction } from "express";
import type { UserJwtPayload } from "../utils/jwt.util.js";
import type { PlacementApplicationCreateInput, PlacementApplicationIdParamInput } from "../modules/placement_application/placement_application.type.js";
import { approvePlacementApplicationService, createPlacementApplicationService, viewPlacementApplicationService } from "../modules/placement_application/placement_application.service.js";

export const createPlacementApplicationController = async (
    req: Request<{}, {}, PlacementApplicationCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newPlacementApplication = await createPlacementApplicationService(req.body, req.user as UserJwtPayload);
        res.status(201).json({
            success: true,
            message: "Placement Application created successfully",
            data: newPlacementApplication
        });
    } catch(error) {
        next(error);
    }
}

export const viewPlacementApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const appliedPlacement = await viewPlacementApplicationService(req.user as UserJwtPayload);

        res.status(200).json({
            success: true,
            message: "Placement Applications fetched successfully",
            data: appliedPlacement
        });
    } catch (error) {
        next(error);
    }
}

export const approvePlacementApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const params = (req.params as PlacementApplicationIdParamInput);
        const {student_id, placement_id} = params;
        const approvedPlacement = await approvePlacementApplicationService(student_id, placement_id, req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: "Placement Application approved successfully",
            data: approvedPlacement
        });
    } catch (error) {
        next(error);
    }
}