import type { IUser } from "../types/user.type.js";
import pool from "../config/db.js";
import { type ResultSetHeader, type RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket, IUser{}

class User {
    static async findByEmail(email: string): Promise<IUser | null> {
        const query = "SELECT * FROM users WHERE email = ? LIMIT 1";
        const [rows] = await pool.execute<UserRow[]>(query, [email]);
        return rows[0] ?? null;
    }

    static async findById(id: number): Promise<IUser | null> {
        const query = "SELECT * FROM users WHERE id = ? LIMIT 1";
        const [rows] = await pool.execute<UserRow[]>(query, [id]);
        return rows[0] ?? null;
    }

    static async create(userData: Omit<IUser, 'id'>): Promise<IUser | null> {
        const query = "INSERT INTO users (email, password) VALUES (?, ?)";
        const {email, password} = userData;

        const [result] = await pool.execute<ResultSetHeader>(query, [email, password]);

        return await this.findById(result.insertId);
    }
}

export default User;