import Admin from "../models/admin.model.js";
import type { adminDashboardOutput } from "../types/admin.type.js";
import ApiError from "../utils/ApiError.js";

export const admintDashboardService = async (): Promise<adminDashboardOutput> => {
    const adminDashboard = await Admin.getDashboard();
    if (!adminDashboard) {
        throw new ApiError(500, "Could not fetch dashbord");
    }

    return adminDashboard;
}