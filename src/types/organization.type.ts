import type { organization_table } from "@prisma/client";
import type { userCreateData } from "./user.type.js";
import type z from "zod";
import type { organizationRegisterSchema } from "../validations/organization.validation.js";

export interface IOrganization extends organization_table{};
// export interface IOrganization {
//     user_id: number,
//     name: string,
//     approval_id: number,
//     is_active: boolean,
// }

export type organizationCreateData = Pick<IOrganization, 'name'> & Pick<userCreateData, 'email' | 'mobile_no' | 'password'>;

export type organizationRegisterInput = z.infer<typeof organizationRegisterSchema>['body'];