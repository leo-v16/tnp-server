import { Prisma } from "@prisma/client";
import prisma from "../config/db.prisma.js";
import type { ITraining, trainingCreateData } from "../types/training.type.js";
import Student from "./student.model.js";

class Training {
    static async findById(training_id: number): Promise<ITraining | null> {
        const training = prisma.training_table.findUnique({
            where: {training_id}
        });
        return training;
    }

    static async create(trainingData: trainingCreateData): Promise<ITraining | null> {
        const training = prisma.training_table.create({
            data: trainingData
        });
        return training;
    }

    static async getEligibleById(student_id: number): Promise<ITraining[] | null> {
        const student = await Student.findById(student_id);
        const trainingList = await prisma.training_table.findMany({
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

        return trainingList;
    }

    static async findByCreatorId(creator_id: number): Promise<ITraining[] | null> {
        const trainingList = await prisma.training_table.findMany({
            where: {
                creator_id: creator_id
            }
        });
        return trainingList;
    }
}

export default Training;