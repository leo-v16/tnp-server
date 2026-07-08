import { getOneOrganizationService, getOrganizationsService, registerOrganizationService, updateOrganizationStatusService } from "../services/organization.service.js";
import type { Request, Response, NextFunction } from "express";
import type { UserJwtPayload } from "../utils/jwt.util.js";
import type { OrganizationIdParamInput, OrganizationRegisterInput } from "../types/organization.type.js";

export const registerOrganizationController = async (
    req: Request<{}, {}, OrganizationRegisterInput>,
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

export const updateOrganizationStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { organization_id } = req.params as any;
        const { approval_id } = req.body;
        const updatedOrganization = await updateOrganizationStatusService(Number(organization_id), approval_id, req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: `Successfully updated organization approval status`,
            data: updatedOrganization
        });
    } catch (error) {
        next(error);
    }
}

export const getOrganizationsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status } = req.query as any;
        const organizationList = await getOrganizationsService(status);
        res.status(200).json({
            success: true,
            message: "Successfully fetched organizations",
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
        const organization_id = (req.params as OrganizationIdParamInput).organization_id;
        const organization = await getOneOrganizationService(organization_id);
        res.status(200).json({
            success: true,
            message: "Successfully fetched organization details",
            data: organization
        });
    } catch (error) {
        next(error);
    }
}