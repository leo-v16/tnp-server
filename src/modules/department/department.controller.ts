import type { Request, Response, NextFunction } from "express";
import { departmentRegisterService, getAllDepartmentService } from "./department.service.js";
import type { UserJwtPayload } from "../../utils/jwt.util.js";
import type { DepartmentRegisterInput } from "./department.type.js";
import Data from "../../utils/data.util.js";

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
            data: departmentList.map((department) => Data.sanitize(department))
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
        const newDepartment = await departmentRegisterService(req.body, req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: "Successfully registered department",
            data: Data.sanitize(newDepartment)
        });
    } catch (error) {
        next(error);
    }
}
