import type { Request, Response, NextFunction } from "express";
import type { studentRegisterInput, studentUpdateInput } from "../types/student.type.js";
import { registerStudentService, updateStudentService } from "../services/student.service.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";
import type { studentUpdateSchema } from "../validations/student.validation.js";
import Student from "../models/student.model.js";

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

export const updateStudentController = async (
    req: Request<{}, {}, studentUpdateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newStudent = await updateStudentService(req.body, req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: `Student with roll: ${newStudent.roll_no} updated`,
            data: newStudent
        });
    } catch (error) {
        next(error);
    }
}

export const studentUpdateAdminController = async (
    req: Request<{}, {}, studentUpdateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newStudent = await updateStudentAdminService(req.body, req.user as UserJwtPayload);
        res.status(200).json({
            success: true,
            message: `Student with roll: ${newStudent.roll_no} updated`,
            data: newStudent
        });
    } catch (error) {
        next(error);
    }
}

export const getStudentController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const studentList = await Student.getAll();
        res.status(200).json({
            success: true,
            message: "Successfully fetched students",
            data: studentList
        })
    } catch (error) {
        next(error);
    }
}