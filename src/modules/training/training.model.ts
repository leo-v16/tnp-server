import { Prisma } from "@prisma/client";
import prisma from "../../config/db.prisma.js";
import Student from "../student/student.model.js";
import Data from "../../utils/data.util.js";

class Training {
    static async findById(training_id: number) {
        const training = await prisma.training_table.findUnique({
            where: {training_id}
        });
        return training;
    }

    static async create(trainingData: Prisma.training_tableCreateManyInput) {
        const newTraining = prisma.training_table.create({
            data: trainingData
        });
        return newTraining;
    }

    static async findCount(): Promise<number> {
        const trainingCount = await prisma.training_table.count();
        return trainingCount;
    }

    static async findCountByFilter(filter: {
        department_id?: number,
        student_id?: number,
        status_id?: number,
        is_active?: boolean
    }): Promise<number | null> {
        const whereClause: Prisma.training_tableWhereInput = {};
        if (filter.is_active !== undefined) {
            whereClause.is_active = filter.is_active;
        }

        if (filter.department_id !== undefined) {
            whereClause.training_department_table = {
                some: {
                    department_id: filter.department_id
                }
            }
        }

        if (filter.student_id !== undefined) {
            whereClause.training_application_table = {
                some: {
                    student_id: filter.student_id
                }
            }
        }

        if (filter.student_id !== undefined || filter.status_id !== undefined) {
            whereClause.training_application_table = {
                some: Data.filterUndefined({
                    student_id: filter.student_id,
                    status_id: filter.status_id
                })
            }
        }

        const trainingCount = await prisma.training_table.count({
            where: whereClause
        });

        return trainingCount;
    }  

    static async findByFilter(filter: {
        department_id?: number,
        student_id?: number,
        status_id?: number,
        is_active?: boolean
    }) {
        const whereClause: Prisma.training_tableWhereInput = {};
        if (filter.is_active !== undefined) {
            whereClause.is_active = filter.is_active;
        }

        if (filter.department_id !== undefined) {
            whereClause.training_department_table = {
                some: {
                    department_id: filter.department_id
                }
            }
        }

        if (filter.student_id !== undefined) {
            whereClause.training_application_table = {
                some: {
                    student_id: filter.student_id
                }
            }
        }

        if (filter.student_id !== undefined || filter.status_id !== undefined) {
            whereClause.training_application_table = {
                some: Data.filterUndefined({
                    student_id: filter.student_id,
                    status_id: filter.status_id
                })
            }
        }

        const trainingCount = await prisma.training_table.findMany({
            where: whereClause
        });

        return trainingCount;
    }  
    
    static async findOneEligibleById(training_id: number, student_id: number) {
        const student = await Student.findById(student_id);
        const trainingList = await prisma.training_table.findFirst({
            where: {
                training_id: training_id,
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
            },
            include: {
                user_table: {
                    include: {
                        organization_table: {
                            include: {
                                sector_table: true
                            }
                        }
                    }
                }
            }
        });

        return trainingList;
    }

    static async findEligibleById(student_id: number) {
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
            },
            include: {
                user_table: {
                    include: {
                        organization_table: {
                            include: {
                                sector_table: true
                            }
                        }
                    }
                }
            }
        });

        return trainingList;
    }

    static async findByCreatorId(creator_id: number) {
        const trainingList = await prisma.training_table.findMany({
            where: {
                creator_id: creator_id
            }
        });
        return trainingList;
    }

    static async disable(training_id: number) {
        const training = await prisma.training_table.update({
            where: {
                training_id
            },
            data: {
                is_active: false
            }
        });
        return training;
    }
}

export default Training;