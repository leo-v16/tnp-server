import { Prisma } from "@prisma/client";
import type { PlacementCreateData } from "./placement.type.js";
import prisma from "../../config/db.prisma.js";
import Student from "../student/student.model.js";

class Placement {
    static async findById(placement_id: number) {
        const placement = prisma.placement_table.findUnique({
            where: {placement_id}
        });
        return placement;
    }

    static async create(placementData: PlacementCreateData) {
        const newPlacement = prisma.placement_table.create({
            data: placementData
        });
        return newPlacement;
    }

    static async findCount(): Promise<number | null>  {
        const placementCount = await prisma.placement_table.count();
        return placementCount;
    }
    
    static async findOneEligibleById(placement_id: number, student_id: number) {
        const student = await Student.findById(student_id);
        const placementList = await prisma.placement_table.findFirst({
            where: {
                placement_id: placement_id,
                is_active: true,
                OR: [
                    {
                        min_cgpa: null,
                    },
                    {
                        min_cgpa: {
                            lte: student?.cgpa || new Prisma.Decimal(0)
                        }
                    }
                ] 
            }
        });

        return placementList;
    }

    static async findEligibleById(student_id: number) {
        const student = await Student.findById(student_id);
        const placementList = await prisma.placement_table.findMany({
            where: {
                is_active: true,
                OR: [
                    {
                        min_cgpa: null,
                    },
                    {
                        min_cgpa: {
                            lte: student?.cgpa || new Prisma.Decimal(0)
                        }
                    }
                ] 
            }
        });

        return placementList;
    }

    static async findByCreatorId(creator_id: number) {
        const placementList = await prisma.placement_table.findMany({
            where: {
                creator_id: creator_id
            }
        });
        return placementList;
    }
}

export default Placement;