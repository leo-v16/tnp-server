import type { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { IRole } from "../types/role.type.js";

type RoleRow = RowDataPacket & IRole;

class Role {
    static async findById(role_id: number): Promise<IRole | null> {
        const query = "SELECT * FROM role_table WHERE role_id = ? LIMIT 1";
        const [rows] = await pool.execute<RoleRow[]>(query, [role_id]);
        
        return rows[0] ?? null;
    }
}

export default Role;