import { register } from "node:module";
import { registerOrganizationService } from "../services/organization.service.js";
import type { Request, Response, NextFunction } from "express";
import type { organizationRegisterInput } from "../types/organization.type.js";
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