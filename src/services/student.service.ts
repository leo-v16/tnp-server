import type { Prisma } from "@prisma/client";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import type { IStudent, studentCreateData, studentDashboardOutput, studentRegisterInput, studentUpdateAdminInput, studentUpdateData, studentUpdateInput } from "../types/student.type.js";
import ApiError from "../utils/ApiError.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";
import PasswordManager from "../utils/password.util.js";

export const registerStudentService = async (input: studentRegisterInput, actor: UserJwtPayload): Promise<IStudent> => {
    const existingUser = await User.findByEmail(input.email);
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    input.password = await PasswordManager.hashPassword(input.password);
    const newStudent = await Student.create(input);

    if (!newStudent) {
        throw new ApiError(500, "Failed to create new student");
    }
    return newStudent;
}

export const updateStudentService = async (input: studentUpdateInput, actor: UserJwtPayload): Promise<IStudent> => {
    const existingStudent = await Student.findByEmail(actor.auth_email);
    if (!existingStudent) {
        throw new ApiError(404, "Student not found");
    }
    const studentData: studentUpdateInput = {
        email: input.email,
        mobile_no: input.mobile_no,
        has_backlog: input.has_backlog,
        cgpa: input.cgpa,
        tenth_divison_id: input.tenth_divison_id,
        twelfth_division_id: input.twelfth_division_id,
        category_id: input.category_id,
        resume_url: input.resume_url,
        image_url: input.image_url,
    }
     const updatedStudent = await Student.update(actor.auth_user_id, studentData);
    if (!updatedStudent) {
        throw new ApiError(500, "Failed to update student");
    }
    return updatedStudent;
}

export const updateStudentAdminService = async (input: studentUpdateAdminInput, actor: UserJwtPayload): Promise<IStudent> => {
    const existingStudent = await Student.findByEmail(actor.auth_email);
    if (!existingStudent) {
        throw new ApiError(404, "Student not found");
    }

     const updatedStudent = await Student.updateAdmin(actor.auth_user_id, input);
    if (!updatedStudent) {
        throw new ApiError(500, "Failed to update student");
    }
    return updatedStudent;
}

export const studentDashboardService = async (actor: UserJwtPayload): Promise<studentDashboardOutput> => {
    const studentDashboard = await Student.getDashboard(actor.auth_user_id);
    if (!studentDashboard) {
        throw new ApiError(500, "Could not fetch dashbord");
    }

    return studentDashboard;
}