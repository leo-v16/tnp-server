import Admin from "../models/admin.model.js";
import type { AdminDashboardOutput } from "../types/admin.type.js";
import ApiError from "../utils/ApiError.js";

export const adminDashboardService = async (): Promise<AdminDashboardOutput> => {
    const adminDashboard = await Admin.getDashboard();
    if (!adminDashboard) {
        throw new ApiError(500, "Could not fetch dashbord");
    }

    return adminDashboard;
}