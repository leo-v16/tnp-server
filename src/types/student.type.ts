import { type student_table } from "@prisma/client";
import type z from "zod";
import type { studentIdParamSchema, studentRegisterSchema, studentUpdateAdminSchema, studentUpdateSchema } from "../validations/student.validation.js";
import type { userCreateData } from "./user.type.js";
import type { ITrainingApplication } from "./training_application.type.js";
import type { ITraining } from "./training.type.js";
import type { ParamsDictionary } from "express-serve-static-core";

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

export type studentCreateData = Pick<IStudent, 'roll_no' | 'name' | 'age' | 'department_id' | 'gender_id' | 'semester_id'> & Omit<userCreateData, 'role_id'>;
// export type studentCreateData = IStudent & userCreateData;
export type studentUpdateData = z.infer<typeof studentUpdateSchema>['body'];

export type studentRegisterInput = z.infer<typeof studentRegisterSchema>['body'];
export type studentUpdateInput = z.infer<typeof studentUpdateSchema>['body'];
export type studentUpdateAdminInput = z.infer<typeof studentUpdateAdminSchema>['body'];

export type studentDashboardOutput = {
    appliedTrainings: ITrainingApplication[],
    eligibleTrainings: ITraining[]
};

export type studentIdParamInput = z.infer<typeof studentIdParamSchema>['params'] & ParamsDictionary;
