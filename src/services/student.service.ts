import Student from "../models/student.model.js";
import type { IStudent, studentCreateData, studentRegisterInput } from "../types/student.type.js";
import ApiError from "../utils/ApiError.js";
import PasswordManager from "../utils/password.util.js";

export const registerStudentService = async (input: studentRegisterInput): Promise<IStudent> => {
    input.password = await PasswordManager.hashPassword(input.password);
    const newStudent = await Student.create(input); 
    if (!newStudent) {
        throw new ApiError(500, "Failed to create new student");
    }
    return newStudent;
}