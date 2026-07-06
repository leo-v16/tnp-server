import type { role_table } from "@prisma/client";

export const Role = {
    SuperAdmin: 1,
    Student: 2,
    Coordinator: 3,
    Organization: 4
}

export interface IRole extends role_table{};
// export interface IRole {
//     role_id: number,
//     role: string,
// }