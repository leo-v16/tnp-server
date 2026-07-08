import prisma from "../config/db.prisma.js";
import type { IOrganization, organizationCreateData, organizationUpdateData } from "../types/organization.type.js";
import Role from "./role.model.js";
import Student from "./student.model.js";

class Organization {
    static async findById(user_id: number): Promise<IOrganization | null> {
        const organization = await prisma.organization_table.findUnique({
            where: {user_id}
        });
        return organization;
    }

    static async findByEmail(email: string): Promise<IOrganization | null> {
        const user = await prisma.user_table.findFirst({
            where: {
                email: email
            },
            include: {
                organization_table: true
            }
        });
        return user?.organization_table ?? null;
    }

    static async create(organizationData: organizationCreateData): Promise<IOrganization | null> {
        const newOrganization = await prisma.$transaction(async (tx) => {
            const user = await tx.user_table.create({
                data: {
                    email: organizationData.email,
                    password: organizationData.password,
                    role_id: Role.Organization,
                    mobile_no: organizationData.mobile_no
                }
            });

            const organization = await tx.organization_table.create({
                data: {
                    user_id: user.user_id,
                    name: organizationData.name
                }
            });

            return organization;
        });
        return newOrganization;
    }

    static async update(user_id: number, organizationData: organizationUpdateData): Promise<IOrganization | null> {
        const organization = await prisma.organization_table.update({
            where: {
                user_id: user_id,
            },
            data: organizationData
        });

        return organization;
    }

    static async findApproved(): Promise<IOrganization[] | null> {
        return await prisma.organization_table.findMany({
            where: {
                approval_id: 1
            },
            include: {
                user_table: true
            }
        });
    }

    static async findRejected(): Promise<IOrganization[] | null> {
        return await prisma.organization_table.findMany({
            where: {
                approval_id: 2
            },
            include: {
                user_table: true
            }
        });
    }

    static async findPending(): Promise<IOrganization[] | null> {
        return await prisma.organization_table.findMany({
            where: {
                approval_id: 0
            },
            include: {
                user_table: true
            }
        });
    }

    static async getDashboard(department_id: number) {
        const studentInDepartmentList = await prisma.student_table.findMany({
            where: {
                department_id
            },
            include: {
                user_table: true,
                training_application_table: true,
                department_table: true
            }
        });

        const studentInDepartmentCount = await Student.getCountByDepartmentId(department_id);

        const approvedTrainingApplicationInDepartmentList = await prisma.training_application_table.findMany({
            where: {
                status_id: 1,
                student_table: {
                    department_id: department_id
                }
            },
            include: {
                student_table: {
                    include: {
                        user_table: true
                    },
                }
            }
        });

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

        
    } 
}

export default Organization;