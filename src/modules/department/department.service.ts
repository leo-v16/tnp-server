import type { DepartmentDashboardOutput, DepartmentRegisterInput, IDepartment } from "./department.type.js";
import ApiError from "../../utils/ApiError.js";
import type { UserJwtPayload } from "../../utils/jwt.util.js";
import { dashboardService } from "../dashboard/dashboard.service.js";
import Department from "./department.model.js";

export const getAllDepartmentService = async (): Promise<IDepartment[]> => {
    const departmentList = await Department.findAll();
    if (!departmentList) {
        throw new ApiError(500, "Could not fetch department");
    }

    return departmentList;
}

export const departmentRegisterService = async (input: DepartmentRegisterInput,actor: UserJwtPayload): Promise<DepartmentDashboardOutput> => {
    const departmentDashboard = await dashboardService(actor);
    if (!departmentDashboard) {
        throw new ApiError(500, "Could not fetch department dashboard");
    }

    return departmentDashboard as DepartmentDashboardOutput;
}