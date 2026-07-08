import Department from "../models/department.model.js";
import type { departmentDashboardOutput, IDepartment } from "../types/department.type.js";
import ApiError from "../utils/ApiError.js";
import type { UserJwtPayload } from "../utils/jwt.util.js";

export const getAllDepartmentService = async (): Promise<IDepartment[]> => {
    const departmentList = await Department.getAll();
    if (!departmentList) {
        throw new ApiError(500, "Could not fetch department");
    }

    return departmentList;
}

export const departmentDashboardService = async (actor: UserJwtPayload): Promise<departmentDashboardOutput> => {
    const departmentDashboard = await Department.getDashboard(actor.auth_user_id);
    if (!departmentDashboard) {
        throw new ApiError(500, "Could not fetch department dashboard");
    }

    return departmentDashboard;
}