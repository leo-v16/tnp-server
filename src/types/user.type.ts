import z from "zod"
import { Role } from "./role.type.js"
import type { userRegisterSchema } from "../validations/user.validation.js"

export interface IUser {
    id: number,
    email: string,
    password: string,
    role: Role
}

export type userRegisterInput = z.infer<typeof userRegisterSchema>['body']