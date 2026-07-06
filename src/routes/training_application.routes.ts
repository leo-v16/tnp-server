import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { trainingApplicationCreateSchema } from "../validations/training_application.validation.js";
import { createTrainingApplicationController } from "../controllers/training_application.controller.js";

const trainingApplicationRouter = Router();

trainingApplicationRouter
.post("/", validate(trainingApplicationCreateSchema), createTrainingApplicationController)

export default trainingApplicationRouter;