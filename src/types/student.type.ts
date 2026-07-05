import { type student_table } from "@prisma/client";

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

export type studentCreateData = Pick<IStudent, 'roll_no' | 'name'>;
export type studentUpdateData = Partial<Omit<IStudent, 'user_id'>>;

