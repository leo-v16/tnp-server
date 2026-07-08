import Role from "../models/role.model.js";
import type { IStudent, studentCreateData, studentDashboardOutput, studentUpdateData } from "../types/student.type.js";
import prisma from "../config/db.prisma.js";
import type { Prisma } from "@prisma/client";
import Data from "../utils/data.util.js";
import Training from "./training.model.js";

class Student {
    static async findById(user_id: number): Promise<IStudent | null> {
        const student = await prisma.student_table.findUnique({
            where: {user_id}
        });
        return student;
    }

    static async findByEmail(email: string): Promise<IStudent | null> {
        const student = await prisma.user_table.findUnique({
            where: {
                email
            },
            include: {
                student_table: true
            }
        });
        return student?.student_table ?? null;
    }

    static async create(studentData: studentCreateData): Promise<IStudent | null> {
        const newStudent = await prisma.$transaction(async (tx) => {
            const user = await tx.user_table.create({
                data: {
                    email: studentData.email,
                    password: studentData.password,
                    role_id: Role.Student,
                    mobile_no: studentData.mobile_no
                }
            });

            const student = await tx.student_table.create({
                data: {
                    user_id: user.user_id,
                    roll_no: studentData.roll_no, 
                    name: studentData.name, 
                    age: studentData.age, 
                    semester_id: studentData.semester_id,
                    department_id: studentData.department_id, 
                    gender_id: studentData.gender_id
                }
            });

            return student;
        });
        return newStudent;
    }

    static async getAll(): Promise<IStudent[] | null> {
        const studentList = await prisma.student_table.findMany({
            include: {
                user_table: true
            }
        });
        return studentList;
    }

    static async update(user_id: number, updateData: studentUpdateData): Promise<IStudent | null> {

        const userData: Prisma.user_tableUpdateInput = Data.filterUndefined({
            email: updateData.email,
            mobile_no: updateData.mobile_no
        });

        const studentData: Prisma.student_tableUncheckedUpdateInput = Data.filterUndefined({
            has_backlog: updateData.has_backlog,
            cgpa: updateData.cgpa,
            resume_url: updateData.resume_url,
            image_url: updateData.image_url,
            tenth_division_id: updateData.tenth_divison_id,
            twelfth_division_id: updateData.twelfth_division_id,
            category_id: updateData.category_id
        });

        const studentList = await prisma.$transaction(async (tx)=> {
            const user = await prisma.user_table.update({
                where: {
                    user_id: user_id,
                },
                data: userData
            });
            
            const student = await prisma.student_table.update({
                where: {
                    user_id: user.user_id
                },
                data: studentData,
                include: {
                    user_table: true
                }
            });

            return student;
        })

        return studentList;
    }

    static async getDashboard(user_id: number): Promise<studentDashboardOutput | null> {
        const appliedTrainings = await prisma.training_application_table.findMany({
            where: {
                student_id: user_id
            },
            include: {
                training_table: true
            }
        });

        const eligibleTrainings = await Training.getEligibleById(user_id);

        return { appliedTrainings: appliedTrainings, eligibleTrainings: eligibleTrainings ?? []};
    }

    static async updateAdmin(user_id: number, updateData: studentUpdateData): Promise<IStudent | null> {
        const userData: Prisma.user_tableUpdateInput = Data.filterUndefined({
            email: updateData.email,
            mobile_no: updateData.mobile_no
        });

        const studentData: Prisma.student_tableUncheckedUpdateInput = Data.filterUndefined({
            has_backlog: updateData.has_backlog,
            cgpa: updateData.cgpa,
            resume_url: updateData.resume_url,
            image_url: updateData.image_url,
            tenth_division_id: updateData.tenth_divison_id,
            twelfth_division_id: updateData.twelfth_division_id,
            category_id: updateData.category_id
        });

        const studentList = await prisma.$transaction(async (tx)=> {
            const user = await prisma.user_table.update({
                where: {
                    user_id: user_id,
                },
                data: userData
            });
            
            const student = await prisma.student_table.update({
                where: {
                    user_id: user.user_id
                },
                data: studentData,
                include: {
                    user_table: true
                }
            });

            return student;
        })

        return studentList;
    }
}

export default Student;