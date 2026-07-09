import { Prisma, type student_table } from "@prisma/client";
import type z from "zod";
import type { studentIdParamSchema, studentRegisterSchema, studentUpdateAdminSchema, studentUpdateSchema } from "../validations/student.validation.js";
import type { ITrainingApplication } from "./training_application.type.js";
import type { ITraining } from "./training.type.js";
import type { ParamsDictionary } from "express-serve-static-core";
import type { IPlacementApplication } from "./placement_application.type.js";
import type { IPlacement } from "./placement.type.js";

export interface IStudent extends student_table {};

// export interface IStudent {
//     user_id: number,
//     roll_no: string,
//     name: string,
//     age: string,
//     semester_id: number,
//     gender_id: number,
//     cgpa: number,
//     tenth_divison_id: number,
//     twelfth_division_id: number,
//     image_url: string,
//     has_backlog: boolean,
//     is_graduate: boolean,
//     category_id: number,
//     resume_url: string,
// }

// export type studentCreateData = Pick<IStudent, 'roll_no' | 'name' | 'age' | 'department_id' | 'gender_id' | 'semester_id'> & Omit<userCreateData, 'role_id'>;
// export type studentCreateData = IStudent & userCreateData;

export type StudentCreateData = Omit<Prisma.student_tableCreateManyInput, 'user_id'> & Omit<Prisma.user_tableCreateManyInput, 'role_id'>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>['body'];

export type StudentUpdateData = Prisma.student_tableUncheckedUpdateInput & Prisma.user_tableUncheckedUpdateInput;
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>['body'];

export type StudentUpdateAdminInput = z.infer<typeof studentUpdateAdminSchema>['body'];

export type StudentIdParamInput = z.infer<typeof studentIdParamSchema>['params'] & ParamsDictionary;

export type { StudentDashboardOutput } from "./dashboard.type.js";

