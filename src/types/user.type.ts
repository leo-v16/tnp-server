import z from "zod"
import { userLoginSchema, type userRegisterSchema } from "../validations/user.validation.js"
import type { IStudent } from "./student.type.js"

export interface IUser {
    user_id: number, 
    role_id: number,
    email: string,
    password: string,
    auth_token: string,
    mobile_no: string,
    created_on: string,
    updated_on: string,
}

export type userCreateData = Pick<IUser, 'email' | 'password' | 'role_id' | 'mobile_no'>;

export type userRegisterInput = z.infer<typeof userRegisterSchema>['body']
export type userLoginInput = z.infer<typeof userLoginSchema>['body']