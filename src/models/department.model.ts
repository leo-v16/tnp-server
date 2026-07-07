import prisma from "../config/db.prisma.js";
import type { CreateDepartmentData, IDepartment } from "../types/department.type.js";

class Department {
    static async findById(department_id: number): Promise<IDepartment | null> {
        const department = await prisma.department_table.findUnique({
            where: {
                department_id
            }
        });
        return department;
    }

    // static async create(departmentData: CreateDepartmentData): Promise<IDepartment | null> {
    //     const newDepartment = await prisma.department_table.create({
    //         data: departmentData
    //     })
    // }
}

export default Department;