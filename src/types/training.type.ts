import type { training_table } from "@prisma/client";
import type z from "zod";
import type { trainingCreateSchema, trainingIdParamSchema } from "../validations/training.validation.js";
import type { ParamsDictionary } from "express-serve-static-core";

export interface ITraining extends training_table{};

export type trainingCreateData = Partial<ITraining> & Pick<ITraining, 'title'>;

export type trainingCreateInput = z.infer<typeof trainingCreateSchema>['body'];

export type TrainingEligibilityResult = {
    isEligible: boolean,
    reason: string
};

export type trainingIdParamInput = z.infer<typeof trainingIdParamSchema>['params'] & ParamsDictionary;