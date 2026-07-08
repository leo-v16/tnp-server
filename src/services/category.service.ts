import Department from "../models/department.model.js";
import type { IDepartment } from "../types/department.type.js";
import ApiError from "../utils/ApiError.js";

export const getAllCategoryService = async (): Promise<IDepartment[]> => {
    const departmentList = await Department.getAll();
    if (!departmentList) {
        throw new ApiError(500, "Could not fetch department");
    }

    return departmentList;
}