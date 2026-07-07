import { approveOrganizationService, getApprovedOrganizationService, getOneOrganizationService, getPendingOrganizationService, getRejectedOrganizationService, registerOrganizationService, rejectOrganizationService } from "../services/organization.service.js";
import type { Request, Response, NextFunction } from "express";
import type { organizationIdParamInput, organizationRegisterInput, organizationStatusInput } from "../types/organization.type.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";
import { success } from "zod";

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
    req: Request<{}, {}, organizationStatusInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newOrganization = await approveOrganizationService(req.body, req.user as UserJwtPayload);
        res.status(201).json({
            success: true,
            message: `Organization with email: ${req.body.email} approved`,
            data: newOrganization
        });
    } catch (error) {
        next(error);
    }
}

export const rejectOrganizationController = async (
    req: Request<{}, {}, organizationStatusInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newOrganization = await rejectOrganizationService(req.body, req.user as UserJwtPayload);
        res.status(201).json({
            success: true,
            message: `Organization with email: ${req.body.email} rejected`,
            data: newOrganization
        });
    } catch (error) {
        next(error);
    }
}

export const getApprovedOrganizationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationList = await getApprovedOrganizationService();
        res.status(200).json({
            success: true,
            message: "Successfully fetched list of approved organization",
            data: organizationList
        });
    } catch (error) {
        next(error);
    }
}

export const getRejectedOrganizationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationList = await getRejectedOrganizationService();
        res.status(200).json({
            success: true,
            message: "Successfully fetched list of approved organization",
            data: organizationList
        });
    } catch (error) {
        next(error);
    }
}

export const getPendingOrganizationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationList = await getPendingOrganizationService();
        res.status(200).json({
            success: true,
            message: "Successfully fetched list of approved organization",
            data: organizationList
        });
    } catch (error) {
        next(error);
    }
}

export const getOneOrganizationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organization_id = (req.params as organizationIdParamInput).organization_id;
        const organizationList = await getOneOrganizationService(organization_id);
        res.status(200).json({
            success: true,
            message: "Successfully fetched list of approved organization",
            data: organizationList
        });
    } catch (error) {
        next(error);
    }
}