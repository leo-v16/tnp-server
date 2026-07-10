import prisma from "../../config/db.prisma.js";
import Student from "../student/student.model.js";
import type { DepartmentDashboardOutput, IDepartment } from "./department.type.js";


class Department {
    static async findById(department_id: number): Promise<IDepartment | null> {
        const department = await prisma.department_table.findUnique({
            where: {
                department_id
            }
        });
        return department;
    }

    static async findAll(): Promise<IDepartment[] | null> {
        const departmentList = await prisma.department_table.findMany();
        return departmentList;
    }

    static async findCount(): Promise<number| null>{
        const departmentCount = await prisma.department_table.count();
        return departmentCount;
    }

    // static async create(departmentDataInput: departmentRegisterInput): Promise<IDepartment | null> {
    //     const newDepartment = await prisma.$transaction(async (tx) => {
    //         tx.user_table.create({
    //             data: {

    //             }
    //         })
    //     })
    // }

    static async getDashboard(department_id: number): Promise<DepartmentDashboardOutput | null> {
        const studentInDepartmentCount = await Student.findCountByDepartmentId(department_id);
        const organizationCount = await prisma.organization_table.count();

        const approvedTrainingApplicationInDepartmentCount = await prisma.training_application_table.count({
            where: {
                status_id: 1,
                student_table: {
                    department_id
                }
            }
        });

        const trainingApplicationInDepartmentCount = await prisma.training_application_table.count({
            where: {
                student_table: {
                    department_id
                }
            }
        });

        const approvedPlacementApplicationInDepartmentCount = await prisma.placement_application_table.count({
            where: {
                status_id: 1,
                student_table: {
                    department_id
                }
            }
        });

        const placementApplicationInDepartmentCount = await prisma.placement_application_table.count({
            where: {
                student_table: {
                    department_id
                }
            }
        });

        return {
            studentCount: studentInDepartmentCount ?? 0,
            organizationCount: organizationCount,
            trainingApplicationCount: trainingApplicationInDepartmentCount,
            trainingPercentage: trainingApplicationInDepartmentCount > 0 ? (approvedTrainingApplicationInDepartmentCount / trainingApplicationInDepartmentCount) * 100 : 0,
            placementApplicationCount: placementApplicationInDepartmentCount,
            placementApplicationPercentage: placementApplicationInDepartmentCount > 0 ? (approvedPlacementApplicationInDepartmentCount / placementApplicationInDepartmentCount) * 100 : 0,
        }
    } 

    

    // static async create(departmentData: CreateDepartmentData): Promise<IDepartment | null> {
    //     const newDepartment = await prisma.department_table.create({
    //         data: departmentData
    //     })
    // }
}

export default Department;