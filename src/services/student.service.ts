import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import type { IStudent, studentCreateData, studentRegisterInput } from "../types/student.type.js";
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