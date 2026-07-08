import Department from "../models/department.model.js";
import Semester from "../models/semester.model.js";
import type { ISemester } from "../types/semester.type.js";
import ApiError from "../utils/ApiError.js";

export const getAllSemesterService = async (): Promise<ISemester[]> => {
    const departmentList = await Semester.getAll();
    if (!departmentList) {
        throw new ApiError(500, "Could not fetch department");
    }

    return departmentList;
}