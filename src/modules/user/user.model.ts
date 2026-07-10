import prisma from "../../config/db.prisma.js";

class User {
    static async findByEmail(email: string) {
        const user = prisma.user_table.findUnique({
            where: {email},
            include: {
                role_table: true
            }
        });
        return user;
    }

    static async findById(user_id: number) {
        const user = prisma.user_table.findUnique({
            where: {user_id},
            include: {
                role_table: true
            }
        });
        return user;
    }
    
    static async create(userData: {
        email: string,
        password: string,
        role_id: number,
        mobile_no: string
    }) {
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

    static async findAll() {
        const userList = await prisma.user_table.findMany({
            include: {
                role_table: true
            }
        });
        return userList;
    }
}

export default User;