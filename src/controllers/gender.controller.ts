import type { Request, Response, NextFunction } from "express";
import { getAllDepartmentService } from "../services/department.service.js";
import { getAllGenderService } from "../services/gender.service.js";

export const getAllGenderController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const genderList = await getAllGenderService();
        res.status(200).json({
            success: true,
            message: `Fetched all departments`,
            data: genderList
        });
    } catch (error) {
        next(error);
    }
}
