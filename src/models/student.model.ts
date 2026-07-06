import Role from "../models/role.model.js";
import type { IStudent, studentCreateData, studentUpdateData } from "../types/student.type.js";
import prisma from "../config/db.prisma.js";

class Student {
    static async findById(user_id: number): Promise<IStudent | null> {
        const student = await prisma.student_table.findUnique({
            where: {user_id}
        });
        return student;
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

    static async update(user_id: number, studentData: studentUpdateData): Promise<IStudent | null> {
        const user = await prisma.student_table.update({
            where: {
                user_id: user_id,
            },
            data: studentData
        });

        return user;
    }
}

export default Student;