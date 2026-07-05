import prisma from "../config/db.prisma.js";
import type { ITrainingApplication, TrainingApplicationCreateData } from "../types/training_application.type.js";

class TrainingApplication {
    static async findById(student_id: number, training_id: number): Promise<ITrainingApplication | null> {
        const trainingApplication = await prisma.training_application_table.findUnique({
            where: {
                training_id_student_id: {
                    training_id,
                    student_id
                }
            }
        });
        return trainingApplication;
    }

    static async create(trainingApplicationData: TrainingApplicationCreateData): Promise<ITrainingApplication | null> {
        const newTrainingApplication = await prisma.training_application_table.create({
            data: trainingApplicationData
        });
        return newTrainingApplication;
    }
}

export default TrainingApplication;