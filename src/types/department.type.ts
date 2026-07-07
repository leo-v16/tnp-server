import type { department_table } from "@prisma/client";

export interface IDepartment extends department_table {};
// export interface IDepartment {
//     department_id: number,
//     dept_name: string,
//     is_active: boolean,
// }

export type CreateDepartmentData = Omit<IDepartment, 'department_id'>;