import prisma from "../config/db.prisma.js";
import type { IGender } from "../types/gender.type.js";

class Gender {
    static async findById(gender_id: number): Promise<IGender | null> {
        const gender = await prisma.gender_table.findUnique({
            where: {
                gender_id
            }
        });
        return gender;
    }

    static async findAll(): Promise<IGender[] | null> {
        const genderList = await prisma.gender_table.findMany();
        return genderList;
    }
}

export default Gender;