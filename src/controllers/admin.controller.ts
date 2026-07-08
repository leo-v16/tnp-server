import type { Request, Response, NextFunction } from "express";
import { adminDashboardService } from "../services/admin.service.js";

export const adminDashboardController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const adminDashboard = await adminDashboardService();
        res.status(200).json({
            success: true,
            message: `Fetched admin dashboard`,
            data: adminDashboard
        });
    } catch (error) {
        next(error);
    }
}
