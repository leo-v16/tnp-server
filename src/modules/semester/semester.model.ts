import prisma from "../config/db.prisma.js";
import type { ISemester } from "../modules/semester/semester.type.js";

class Semester {
    static async findById(semester_id: number): Promise<ISemester | null> {
        return await prisma.semester_table.findUnique({
            where: {
                semester_id
            }
        });
    }

    static async findAll(): Promise<ISemester[] | null> {
        return await prisma.semester_table.findMany();
    }
}

export default Semester;