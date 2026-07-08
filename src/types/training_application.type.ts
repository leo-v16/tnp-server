import type { training_application_table } from "@prisma/client";
import type z from "zod";
import type { trainingApplicationCreateSchema, trainingApplicationIdParamSchema } from "../validations/training_application.validation.js";
import type { ParamsDictionary } from "express-serve-static-core";

export interface ITrainingApplication extends training_application_table{};

export type TrainingApplicationCreateData = Pick<ITrainingApplication, 'student_id' | 'training_id'>;
export type TrainingApplicationCreateInput = z.infer<typeof trainingApplicationCreateSchema>['body'];

export type trainingApplicationIdParamInput = z.infer<typeof trainingApplicationIdParamSchema>['params'] & ParamsDictionary; 