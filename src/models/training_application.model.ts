import prisma from "../config/db.prisma.js";
import type { ITrainingApplication, TrainingApplicationCreateData } from "../types/training_application.type.js";
import Role from "./role.model.js";
import User from "./user.model.js";

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

    static async findByStudentId(student_id: number): Promise<ITrainingApplication[] | null> {
        const appliedTraining = await prisma.training_application_table.findMany({
            where: {
                student_id
            },
            include: {
                training_table: {
                    include: {
                        user_table: {
                            include: {
                                organization_table: true
                            }
                        }
                    }
                }
            }
        });

        return appliedTraining
    }

    static async findByCreatorId(creator_id: number): Promise<ITrainingApplication[] | null> {
        const appliedTraining = await prisma.training_application_table.findMany({
            where: {
                training_table: {
                    creator_id: creator_id
                }
            },
            include: {
                training_table: true,
                student_table: true
            }
        });

        return appliedTraining
    }

    static async findByDepartmentId(department_id: number): Promise<ITrainingApplication[] | null> {
        const appliedTraining = await prisma.training_application_table.findMany({
            where: {
                training_table: {
                    creator_id: department_id
                },
                student_table: {
                    department_id
                }
            },
            include: {
                training_table: true,
                student_table: true
            }
        });

        return appliedTraining
    }
}

export default TrainingApplication;