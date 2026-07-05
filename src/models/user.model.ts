import type { IUser } from "../types/user.type.js";
import pool from "../config/db.mysql.js";
import { type ResultSetHeader, type RowDataPacket } from "mysql2";

type UserRow = RowDataPacket & IUser;

class User {
    static async findByEmail(email: string): Promise<IUser | null> {
        const query = "SELECT * FROM users WHERE email = ? LIMIT 1";
        const [rows] = await pool.execute<UserRow[]>(query, [email]);
        return rows[0] ?? null;
    }

    static async findById(user_id: number): Promise<IUser | null> {
        const query = "SELECT * FROM users WHERE user_id = ? LIMIT 1";
        const [rows] = await pool.execute<UserRow[]>(query, [user_id]);
        return rows[0] ?? null;
    }
    

    static async create(userData: Omit<IUser, 'user_id' | 'auth_token' | 'created_on' | 'updated_on'>): Promise<IUser | null> {
        const query = "INSERT INTO users (email, password, role_id, mobile_no) VALUES (?, ?, ?, ?)";
        const {email, password, role_id, mobile_no} = userData;

        const [result] = await pool.execute<ResultSetHeader>(query, [email, password, role_id, mobile_no]);

        return await this.findById(result.insertId);
    }
}

export default User;