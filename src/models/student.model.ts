import { type ResultSetHeader, type RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { IStudent, studentCreateData, studentUpdateData } from "../types/student.type.js";
import { buildUpdateQuery } from "../utils/db.util.js";
import ApiError from "../utils/ApiError.js";

type StudentRow = RowDataPacket & IStudent;

class Student {
    static async findById(user_id: number): Promise<IStudent | null> {
        const query = "SELECT * FROM student_table WHERE user_id = ? LIMIT 1";
        const [rows] = await pool.execute<StudentRow[]>(query, [user_id]);

        return rows[0] ?? null;
    }

    static async create(studentData: studentCreateData): Promise<IStudent | null> {
        const query = "INSERT INTO student_table (roll_no, name) values (?, ?)";
        const {roll_no, name} = studentData;
        const [result] = await pool.execute<ResultSetHeader>(query, [roll_no, name]);

        return await this.findById(result.insertId);
    }

    static async update(user_id: number, studentData: studentUpdateData): Promise<IStudent | null> {
        const { setClauses, values } = buildUpdateQuery(studentData);
        const query = `UPDATE student_table SET ${setClauses} WHERE user_id = ${user_id}`;

        try {
            const [result] = await pool.execute<ResultSetHeader>(query, values);
            if (result.affectedRows === 0) {
                return null;
            }

            return await this.findById(result.insertId);
        } catch(error) {
            console.error(`[Student.update] Error updating user_id ${user_id}: `, error);
            
            throw new ApiError(500, "Database query failed during update operation.");
        }
    }
}

export default Student;