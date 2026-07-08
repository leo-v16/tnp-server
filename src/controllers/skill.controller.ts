import type { Request, Response, NextFunction } from "express";
import { getAllDepartmentService } from "../services/department.service.js";
import { getAllSkillService } from "../services/skill.service.js";

export const getAllSkillController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const skillList = await getAllSkillService();
        res.status(200).json({
            success: true,
            message: `Fetched all departments`,
            data: skillList
        });
    } catch (error) {
        next(error);
    }
}
