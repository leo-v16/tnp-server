import prisma from "../config/db.prisma.js";
import type { IDivision } from "../types/division.type.js";
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
}

export default Gender;