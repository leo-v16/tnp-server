import { register } from "node:module";
import { approveOrganizationService, registerOrganizationService } from "../services/organization.service.js";
import type { Request, Response, NextFunction } from "express";
import type { organizationApproveInput, organizationRegisterInput } from "../types/organization.type.js";
import { email } from "zod";

export const registerOrganizationController = async (
    req: Request<{}, {}, organizationRegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newOrganization = await registerOrganizationService(req.body);
        res.status(201).json({
            success: true,
            message: `Organization with email: ${email} created`,
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
        const newOrganization = await approveOrganizationService(req.body);
        res.status(201).json({
            success: true,
            message: `Organization with email: ${email} created`,
            data: newOrganization
        });
    } catch (error) {
        next(error);
    }
}