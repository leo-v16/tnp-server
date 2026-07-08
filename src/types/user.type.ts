import z from "zod";
import { userIdParamSchema, userLoginSchema, type userRegisterSchema } from "../validations/user.validation.js";
import {Prisma, type user_table} from "@prisma/client";
import type { ParamsDictionary } from "express-serve-static-core";  

export interface IUser extends user_table{};

// export interface IUser {
//     user_id: number, 
//     role_id: number,
//     email: string,
//     password: string,
//     auth_token: string,
//     mobile_no: string,
//     created_on: string,
//     updated_on: string,
// }

// export type userCreateData = Pick<IUser, 'email' | 'password' | 'role_id' | 'mobile_no'>;
export type UserCreateData = Prisma.user_tableCreateManyInput;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>['body'];

export type UserLoginInput = z.infer<typeof userLoginSchema>['body'];
export type UserIdParamInput = z.infer<typeof userIdParamSchema>['params'] & ParamsDictionary;