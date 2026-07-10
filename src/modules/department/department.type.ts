import type { department_table } from "@prisma/client";
import type z from "zod";
import type { departmentRegisterSchema } from "./department.validation.js";

export interface IDepartment extends department_table {};
// export interface IDepartment {
//     department_id: number,
//     dept_name: string,
//     is_active: boolean,
// }

export type CreateDepartmentData = Omit<IDepartment, 'department_id'>;

export type { DepartmentDashboardOutput } from "../dashboard/dashboard.type.js";

export type DepartmentRegisterInput = z.infer<typeof departmentRegisterSchema>['body'];
export type DepartmentRegisterData = DepartmentRegisterInput;