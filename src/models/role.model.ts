import type { RowDataPacket } from "mysql2";
import pool from "../config/db.mysql.js";
import type { IRole } from "../types/role.type.js";

type RoleRow = RowDataPacket & IRole;

class Role {
    static SuperAdmin: number = 1; 
    static Student: number = 2; 
    static Coordinator: number = 3; 
    static Organization: number = 4; 

    static async findById(role_id: number): Promise<IRole | null> {
        const query = "SELECT * FROM role_table WHERE role_id = ? LIMIT 1";
        const [rows] = await pool.execute<RoleRow[]>(query, [role_id]);
        
        return rows[0] ?? null;
    }
}

export default Role;