import prisma from "../config/db.prisma.js";
import type { adminDashboardOutput } from "../types/admin.type.js";

class Admin {
    static async getDashboard(): Promise<adminDashboardOutput> {
        const totalStudentCount = await prisma.student_table.count();
        const totalDepartmentCount = await prisma.department_table.count();
        const totalOrganizationCount = await prisma.organization_table.count();
        const totalTrainingCount = await prisma.training_table.count();
        const trainingApplicationCount = await prisma.training_application_table.count()
        const approvedTrainingApplicationCount = await prisma.training_application_table.count({
            where: {
                status_id: 1
            }
        });

        return {
            studentCount: totalStudentCount,
            departmentCount: totalDepartmentCount,
            organizationCount: totalOrganizationCount,
            trainingCount: totalTrainingCount,
            trainingPercentage: (approvedTrainingApplicationCount/trainingApplicationCount) * 100
        }
    }
}

export default Admin;