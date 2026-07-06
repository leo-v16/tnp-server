import prisma from "../config/db.prisma.js";
import type { ITraining, trainingCreateData } from "../types/training.type.js";

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
}

export default Training;