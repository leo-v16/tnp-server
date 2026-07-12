import prisma from "../../config/db.prisma.js";
import type { Prisma } from "@prisma/client";
import Data from "../../utils/data.util.js";
import type { StudentCreateData, StudentUpdateData } from "./student.type.js";
import Role from "../role/role.model.js";

class Student {
    static async findById(user_id: number) {
        const student = await prisma.student_table.findUnique({
            where: {user_id},
            include: {
                training_application_table: true,
                department_table: true,
                student_skill_table: {
                    include: {
                        skill_table: true
                    }
                },
                user_table: true,
                gender_table: true,
                category_table: true,
                semester_table: true,
                
                division_table_student_table_tenth_division_idTodivision_table: true,
                division_table_student_table_twelfth_division_idTodivision_table: true
            }
        });
        return student;
    }

    static async findByEmail(email: string) {
        const student =  await prisma.student_table.findFirst({
            where: {
                user_table: {
                    email
                }
            },
            include: {
                user_table: true
            }
        });
        return student;
    }

    static async create(studentData: StudentCreateData) {
        const newStudent = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user_table.create({
                data: {
                    email: studentData.email,
                    password: studentData.password,
                    role_id: Role.Student,
                    mobile_no: studentData.mobile_no
                }
            });

            const newStudent = await tx.student_table.create({
                data: {
                    user_id: newUser.user_id,
                    roll_no: studentData.roll_no, 
                    name: studentData.name, 
                    age: studentData.age, 
                    semester_id: studentData.semester_id,
                    department_id: studentData.department_id, 
                    gender_id: studentData.gender_id
                }
            });

            return newStudent;
        });
        return newStudent
    }
    static async findCount(): Promise<number> {
        const studentCount = await prisma.student_table.count();
        return studentCount;
    }

    static async findAll() {
        const studentList = await prisma.student_table.findMany({
            include: {
                user_table: true,
                department_table: true,
                category_table: true,
                gender_table: true,
                semester_table: true,
                division_table_student_table_tenth_division_idTodivision_table: true,
                division_table_student_table_twelfth_division_idTodivision_table: true,
                student_skill_table: true
            }
        });
        return studentList;
    }

    static async update(user_id: number, updateData: StudentUpdateData) {
        const userData: Prisma.user_tableUncheckedUpdateInput = Data.filterUndefined({
            email: updateData.email,
            mobile_no: updateData.mobile_no
        });

        const studentData: Prisma.student_tableUncheckedUpdateInput = Data.filterUndefined({
            has_backlog: updateData.has_backlog,
            cgpa: updateData.cgpa,
            resume_url: updateData.resume_url,
            image_url: updateData.image_url,
            tenth_division_id: updateData.tenth_division_id,
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

    static async updateAdmin(user_id: number, updateData: StudentUpdateData) {
        const userData: Prisma.user_tableUpdateInput = Data.filterUndefined({
            email: updateData.email,
            mobile_no: updateData.mobile_no
        });

        const studentData: Prisma.student_tableUncheckedUpdateInput = Data.filterUndefined({
            has_backlog: updateData.has_backlog,
            cgpa: updateData.cgpa,
            resume_url: updateData.resume_url,
            image_url: updateData.image_url,
            tenth_division_id: updateData.tenth_division_id,
            twelfth_division_id: updateData.twelfth_division_id,
            category_id: updateData.category_id
        });

        return await prisma.$transaction(async (tx)=> {
            const user = await tx.user_table.update({
                where: {
                    user_id: user_id,
                },
                data: userData
            });
            
            const student = await tx.student_table.update({
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
    }

    static async findCountByDepartmentId(department_id: number): Promise<number> {
        const studentCount = await prisma.student_table.count({
            where: {
                department_id
            }
        });
        return studentCount;
    }

    static async findByDepartmentId(department_id: number) {
        const studentList =  await prisma.student_table.findMany({
            where: {
                department_id
            }
        });
        return studentList;
    }
}

export default Student;