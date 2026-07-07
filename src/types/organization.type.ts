import type { organization_table } from "@prisma/client";
import type { userCreateData } from "./user.type.js";
import type z from "zod";
import type { organizationApproveSchema, organizationIdParamSchema, organizationRegisterSchema } from "../validations/organization.validation.js";
import type { ParamsDictionary } from "express-serve-static-core";

export interface IOrganization extends organization_table{};
// export interface IOrganization {
//     user_id: number,
//     name: string,
//     approval_id: number,
//     is_active: boolean,
// }

export type organizationCreateData = Pick<IOrganization, 'name'> & Pick<userCreateData, 'email' | 'mobile_no' | 'password'>;
export type organizationUpdateData = Partial<Omit<IOrganization, 'user_id'>>;

export type organizationRegisterInput = z.infer<typeof organizationRegisterSchema>['body'];
export type organizationApproveInput = z.infer<typeof organizationApproveSchema>['body'];

export type organizationIdParamInput = z.infer<typeof organizationIdParamSchema>['params'] & ParamsDictionary;
