import prisma from "../config/db.prisma.js";
import type { DepartmentDashboardOutput, IDepartment } from "../types/department.type.js";
import Organization from "./organization.model.js";
import Student from "./student.model.js";

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

        const allOrganizationList = await Organization.findAll();

        return {
            studentCount: studentInDepartmentCount ?? 0,
            organizationList: allOrganizationList ?? [],
            applicationCount: trainingApplicationInDepartmentCount,
            trainingPercentage: (trainingApplicationInDepartmentCount/approvedTrainingApplicationInDepartmentCount) * 100,
        }
    } 

    

    // static async create(departmentData: CreateDepartmentData): Promise<IDepartment | null> {
    //     const newDepartment = await prisma.department_table.create({
    //         data: departmentData
    //     })
    // }
}

export default Department;