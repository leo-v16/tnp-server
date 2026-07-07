import type { training_table } from "@prisma/client";
import type z from "zod";
import type { trainingCreateSchema } from "../validations/training.validation.js";

export interface ITraining extends training_table{};

export type trainingCreateData = Partial<ITraining> & Pick<ITraining, 'title'>;

export type trainingCreateInput = z.infer<typeof trainingCreateSchema>['body'];

export type TrainingEligibilityResult = {
    isEligible: boolean,
    reason: string
};