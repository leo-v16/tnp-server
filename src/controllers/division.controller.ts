import type { Request, Response, NextFunction } from "express";
import { getAllDepartmentService } from "../services/department.service.js";
import { getAllDivisonService } from "../services/division.service.js";

export const getAllDivisionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const divisionList = await getAllDivisonService();
        res.status(200).json({
            success: true,
            message: `Fetched all departments`,
            data: divisionList
        });
    } catch (error) {
        next(error);
    }
}
