import prisma from "../config/db.prisma.js";
import type { ISemester } from "../types/semester.type.js";

class Semester {
    static async findById(semester_id: number): Promise<ISemester | null> {
        const semester = await prisma.semester_table.findUnique({
            where: {
                semester_id
            }
        });
        return semester;
    }
}

export default Semester;