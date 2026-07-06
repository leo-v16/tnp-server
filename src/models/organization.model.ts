import prisma from "../config/db.prisma.js";
import type { IOrganization, organizationCreateData } from "../types/organization.type.js";
import Role from "./role.model.js";

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

    static async update(user_id: number, organizationData: organizationCreateData): Promise<IOrganization | null> {
        const organization = await prisma.organization_table.update({
            where: {
                user_id: user_id,
            },
            data: organizationData
        });

        return organization;
    }
}

export default Organization;