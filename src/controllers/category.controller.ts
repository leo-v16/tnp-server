import type { Request, Response, NextFunction } from "express";
import { getAllDepartmentService } from "../services/department.service.js";
import { getAllCategoryService } from "../services/category.service.js";

export const getAllCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryList = await getAllCategoryService();
        res.status(200).json({
            success: true,
            message: `Fetched all category`,
            data: categoryList
        });
    } catch (error) {
        next(error);
    }
}
