import type { placement_table, Prisma } from "@prisma/client";
import type z from "zod";
import type { ParamsDictionary } from "express-serve-static-core";
import type { placementCreateSchema, placementIdParamSchema } from "./placement.validation.js";

export interface IPlacement extends placement_table{};

export type PlacementCreateData = Prisma.placement_tableCreateManyInput;
export type PlacementCreateInput = z.infer<typeof placementCreateSchema>['body'];

export type PlacementIdParamInput = z.infer<typeof placementIdParamSchema>['params'] & ParamsDictionary;

export type PlacementEligibilityResult = {
    isEligible: boolean,
    reason: string
};