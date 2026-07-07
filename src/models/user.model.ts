import type { IUser, userCreateData } from "../types/user.type.js";
import prisma from "../config/db.prisma.js";

class User {
    static async findByEmail(email: string): Promise<IUser | null> {
        const user = prisma.user_table.findUnique({
            where: {email},
            include: {
                role_table: true
            }
        });
        return user;
    }

    static async findById(user_id: number): Promise<IUser | null> {
        const user = prisma.user_table.findUnique({
            where: {user_id},
            include: {
                role_table: true
            }
        });
        return user;
    }
    
    static async create(userData: userCreateData): Promise<IUser | null> {
        const newUser = await prisma.user_table.create({
            data: {
                email: userData.email,
                password: userData.password,
                role_id: userData.role_id,
                mobile_no: userData.mobile_no
            }
        });
        return newUser;
    }

    static async getAll(): Promise<IUser[] | null> {
        const userList = await prisma.user_table.findMany({
            include: {
                role_table: true
            }
        });
        return userList;
    }
}

export default User;