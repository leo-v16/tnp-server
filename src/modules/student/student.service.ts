import type { Prisma } from "@prisma/client";
import Student from "./student.model.js";
import type { IStudent, StudentCreateData, StudentDashboardOutput, StudentRegisterInput, StudentUpdateAdminInput, StudentUpdateData, StudentUpdateInput } from "./student.type.js";
import ApiError from "../../utils/ApiError.js";
import type { UserJwtPayload } from "../../utils/jwt.util.js";
import PasswordManager from "../../utils/password.util.js";
import Data from "../../utils/data.util.js";
import User from "../user/user.model.js";
import Role from "../role/role.model.js";

export const registerStudentService = async (input: StudentRegisterInput, actor: UserJwtPayload): Promise<IStudent> => {
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

export const updateStudentService = async (input: StudentUpdateInput, actor: UserJwtPayload): Promise<IStudent> => {
    const existingStudent = await Student.findByEmail(actor.auth_email);
    if (!existingStudent) {
        throw new ApiError(404, "Student not found");
    }
    const studentData: StudentUpdateData = Data.filterUndefined({
        email: input.email,
        mobile_no: input.mobile_no,
        has_backlog: input.has_backlog,
        cgpa: input.cgpa,
        tenth_division_id: input.tenth_division_id,
        twelfth_division_id: input.twelfth_division_id,
        category_id: input.category_id,
        resume_url: input.resume_url,
        image_url: input.image_url,
    });
     const updatedStudent = await Student.update(actor.auth_user_id, studentData);
    if (!updatedStudent) {
        throw new ApiError(500, "Failed to update student");
    }
    return updatedStudent;
}

export const updateStudentAdminService = async (student_id: number, input: StudentUpdateAdminInput, actor: UserJwtPayload): Promise<IStudent> => {
    const existingStudent = await Student.findById(student_id);
    if (!existingStudent) {
        throw new ApiError(404, "Student not found");
    }

    const updatedStudent = await Student.updateAdmin(student_id, Data.filterUndefined(input));
    if (!updatedStudent) {
        throw new ApiError(500, "Failed to update student");
    }
    return updatedStudent;
}

export const getStudentByIdService = async (user_id: number, actor: UserJwtPayload) => {
    const student = await Student.findById(user_id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const isSelf = actor.auth_user_id === user_id;
    const isSuperAdmin = actor.auth_role_id === Role.SuperAdmin;
    const isCoordinatorOfDepartment = actor.auth_role_id === Role.Coordinator && student.department_id === actor.auth_user_id;

    if (!isSelf && !isSuperAdmin && !isCoordinatorOfDepartment) {
        throw new ApiError(403, "You do not have permission to access this student's profile");
    }

    return student;
}

export const getStudentService = async () => {
    const studentList = await Student.findAll();
    if (!studentList) {
        throw new ApiError(404, "Couldn't fetch student list");
    }
    return studentList;
}