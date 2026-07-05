import type { role_table } from "@prisma/client";

export enum Role {
    SuperAdmin = "Super Admin",
    Coordinator = "Coordinator",
    Organization = "Organization",
    Student = "Student"
}

export interface IRole extends role_table{};
// export interface IRole {
//     role_id: number,
//     role: string,
// }