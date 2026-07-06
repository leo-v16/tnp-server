import type { IUser, userCreateData } from "../types/user.type.js";
import prisma from "../config/db.prisma.js";

class User {

    static async findByEmail(email: string): Promise<IUser | null> {
        const user = prisma.user_table.findUnique({
            where: {email}
        });
        return user;
    }

    static async findById(user_id: number): Promise<IUser | null> {
        const user = prisma.user_table.findUnique({
            where: {user_id}
        });
        return user;
    }
    
    static async create(userData: userCreateData): Promise<IUser | null> {
        const newUser = prisma.user_table.create({
            data: {
                email: userData.email,
                password: userData.password,
                role_id: userData.role_id,
                mobile_no: userData.mobile_no
            }
        });
        return newUser;
    }
}

export default User;