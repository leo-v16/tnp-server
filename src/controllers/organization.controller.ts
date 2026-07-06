import { approveOrganizationService, registerOrganizationService } from "../services/organization.service.js";
import type { Request, Response, NextFunction } from "express";
import type { organizationApproveInput, organizationRegisterInput } from "../types/organization.type.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";

export const registerOrganizationController = async (
    req: Request<{}, {}, organizationRegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newOrganization = await registerOrganizationService(req.body, req.user as UserJwtPayload);
        res.status(201).json({
            success: true,
            message: `Organization with email: ${req.body.email} created`,
            data: newOrganization
        });
    } catch (error) {
        next(error);
    }
}

export const approveOrganizationController = async (
    req: Request<{}, {}, organizationApproveInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newOrganization = await approveOrganizationService(req.body, req.user as UserJwtPayload);
        res.status(201).json({
            success: true,
            message: `Organization with email: ${req.body.email} created`,
            data: newOrganization
        });
    } catch (error) {
        next(error);
    }
}