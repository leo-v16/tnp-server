import type { Request, Response, NextFunction } from "express";
import { departmentDashboardService, getAllDepartmentService } from "./department.service.js";
import type { UserJwtPayload } from "../../utils/jwt.util.js";
import type { DepartmentRegisterInput } from "./department.type.js";

export const getAllDepartmentController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const departmentList = await getAllDepartmentService();
        res.status(200).json({
            success: true,
            message: `Fetched all departments`,
            data: departmentList
        });
    } catch (error) {
        next(error);
    }
}

export const departmentDashboardController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const departmentDashboard = await departmentDashboardService(req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: `Fetched depratment dashboard`,
            data: departmentDashboard
        });
    } catch (error) {
        next(error);
    }
}

export const departmentRegisterController = async (
    req: Request<{}, {}, DepartmentRegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        // const newDepartment = await departmentRegisterService(req.body, req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: "Department ID has to be made autoincrement",
            data: null
        });
    } catch (error) {
        next(error);
    }
}
