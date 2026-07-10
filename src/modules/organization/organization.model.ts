import prisma from "../../config/db.prisma.js";
import Role from "../role/role.model.js";
import type { IOrganization, OrganizationCreateData, OrganizationUpdateData } from "./organization.type.js";

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

    static async findAll(): Promise<IOrganization[] | null> {
        const organizationList = await prisma.organization_table.findMany();
        return organizationList;
    }

    static async findCount(): Promise<number | null> {
        const organizationCount = await prisma.organization_table.count();
        return organizationCount;
    }

    static async create(organizationData: OrganizationCreateData): Promise<IOrganization | null> {
        const newOrganization = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user_table.create({
                data: {
                    email: organizationData.email,
                    password: organizationData.password,
                    role_id: Role.Organization,
                    mobile_no: organizationData.mobile_no
                }
            });

            const newOrganization = await tx.organization_table.create({
                data: {
                    user_id: newUser.user_id,
                    name: organizationData.name
                }
            });

            return newOrganization;
        });
        return newOrganization;
    }

    static async update(user_id: number, organizationData: OrganizationUpdateData): Promise<IOrganization | null> {
        const organization = await prisma.organization_table.update({
            where: {
                user_id: user_id,
            },
            data: organizationData
        });

        return organization;
    }

    static async findApproved(): Promise<IOrganization[] | null> {
        const organizationList = await prisma.organization_table.findMany({
            where: {
                approval_id: 1
            },
            include: {
                user_table: true
            }
        });
        return organizationList;
    }

    static async findRejected(): Promise<IOrganization[] | null> {
        const organizationList = await prisma.organization_table.findMany({
            where: {
                approval_id: 2
            },
            include: {
                user_table: true
            }
        });
        return organizationList;
    }

    static async findPending(): Promise<IOrganization[] | null> {
        const organizationList = await prisma.organization_table.findMany({
            where: {
                approval_id: 0
            },
            include: {
                user_table: true
            }
        });
        return organizationList;
    }

}

export default Organization;