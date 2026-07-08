import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { trainingApplicationCreateSchema, trainingApplicationIdParamSchema } from "../validations/training_application.validation.js";
import { approveTrainingApplicationController, createTrainingApplicationController, viewTrainingApplicationController } from "../controllers/training_application.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const trainingApplicationRouter = Router();

trainingApplicationRouter
.post("/", authenticate(Role.Student), validate(trainingApplicationCreateSchema), createTrainingApplicationController)
.patch("/:training_id/students/:student_id/status", authenticate([Role.Organization, Role.Coordinator, Role.SuperAdmin]), validate(trainingApplicationIdParamSchema) ,approveTrainingApplicationController)
.get("/", authenticate([Role.Student, Role.Organization, Role.Coordinator, Role.SuperAdmin]), viewTrainingApplicationController)

export default trainingApplicationRouter;