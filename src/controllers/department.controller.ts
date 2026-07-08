import type { Request, Response, NextFunction } from "express";
import { getAllDepartmentService } from "../services/department.service.js";

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
