import type { Request, Response, NextFunction } from "express";
import type { studentRegisterInput } from "../types/student.type.js";
import { registerStudentService } from "../services/student.service.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";

export const registerStudentController = async (
    req: Request<{}, {}, studentRegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newStudent = await registerStudentService(req.body, req.user as UserJwtPayload);
        res.status(201).json({
            success: true,
            message: `Student with roll: ${newStudent.roll_no} created`,
            data: newStudent
        });
    } catch (error) {
        next(error);
    }
}