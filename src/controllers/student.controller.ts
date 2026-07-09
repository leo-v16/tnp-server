import type { Request, Response, NextFunction } from "express";
import { registerStudentService, updateStudentAdminService, updateStudentService, getStudentByIdService } from "../services/student.service.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";
import Student from "../models/student.model.js";
import type { StudentIdParamInput, StudentRegisterInput, StudentUpdateAdminInput, StudentUpdateInput } from "../types/student.type.js";

export const registerStudentController = async (
    req: Request<{}, {}, StudentRegisterInput>,
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
    req: Request<{}, {}, StudentUpdateInput>,
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
    req: Request<{}, {}, StudentUpdateAdminInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user_id: student_id } = req.params as StudentIdParamInput;
        const newStudent = await updateStudentAdminService(student_id, req.body, req.user as UserJwtPayload);
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
        const studentList = await Student.findAll();
        res.status(200).json({
            success: true,
            message: "Successfully fetched students",
            data: studentList
        })
    } catch (error) {
        next(error);
    }
}

export const getStudentMeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const actor = req.user as UserJwtPayload;
        const student = await getStudentByIdService(actor.auth_user_id, actor);
        res.status(200).json({
            success: true,
            message: "Successfully fetched profile",
            data: student
        });
    } catch (error) {
        next(error);
    }
}

export const getStudentByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const actor = req.user as UserJwtPayload;
        const { user_id } = req.params as StudentIdParamInput;
        const student = await getStudentByIdService(Number(user_id), actor);
        res.status(200).json({
            success: true,
            message: "Successfully fetched student profile",
            data: student
        });
    } catch (error) {
        next(error);
    }
}