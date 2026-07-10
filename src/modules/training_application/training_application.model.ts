import type { Prisma } from "@prisma/client";
import prisma from "../../config/db.prisma.js";

class TrainingApplication {
    static async findById(student_id: number, training_id: number) {
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

    static async create(trainingApplicationData: {
        training_id: number,
        student_id: number,
        status_id?: number,
        date_of_submission?: string | Date,
        remarks?: string
    }) {
        const newTrainingApplication = await prisma.training_application_table.create({
            data: trainingApplicationData
        });
        return newTrainingApplication;
    }

    static async findByStudentId(student_id: number) {
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

    static async findByCreatorId(creator_id: number) {
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

    static async findByDepartmentId(department_id: number) {
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

    static async approve(student_id: number, training_id: number) {
        const approvedTraining = await prisma.training_application_table.update({
            where: {
                training_id_student_id: {
                    student_id: student_id,
                    training_id: training_id
                }
            },
            data: {
                status_id: 1
            }
        });

        return approvedTraining;
    }

    static async findCount(): Promise<number> {
        const applicationCount = await prisma.training_application_table.count();
        return applicationCount;
    }

    static async findCountByFilter(filter: {
        creator_id?: number,
        status_id?: number,
        student_id?: number,
    }): Promise<number | null> {
        const whereClause: Prisma.training_application_tableWhereInput = {};

        if (filter.student_id !== undefined) {
            whereClause.student_id = filter.student_id;
        }

        if (filter.status_id !== undefined) {
            whereClause.status_id = filter.status_id;
        }

        if (filter.creator_id !== undefined) {
            whereClause.training_table = {
                creator_id: filter.creator_id,
                
            }
        }

        const applicationCount = await prisma.training_application_table.count({
            where: whereClause
        });

        return applicationCount;
    }


    static async findByFilter(filter: {
        creator_id?: number,
        status_id?: number,
        student_id?: number,
    }) {
        const whereClause: Prisma.training_application_tableWhereInput = {};

        if (filter.student_id !== undefined) {
            whereClause.student_id = filter.student_id;
        }

        if (filter.status_id !== undefined) {
            whereClause.status_id = filter.status_id;
        }

        if (filter.creator_id !== undefined) {
            whereClause.training_table = {
                creator_id: filter.creator_id,
                
            }
        }

        const applicationCount = await prisma.training_application_table.findMany({
            where: whereClause
        });

        return applicationCount;
    }
}

export default TrainingApplication;