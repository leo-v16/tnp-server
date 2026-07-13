import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import Role from "../role/role.model.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { approveTrainingApplicationController, createTrainingApplicationController, getOneTrainingApplicationController, viewTrainingApplicationController } from "./training_application.controller.js";
import { trainingApplicationApproveSchema, trainingApplicationCreateSchema, trainingApplicationIdParamSchema } from "./training_application.validation.js";

const trainingApplicationRouter = Router();

trainingApplicationRouter
.post("/", authenticate(Role.Student), validate(trainingApplicationCreateSchema), createTrainingApplicationController)
.patch("/:training_id/students/:student_id/status", authenticate([Role.Organization, Role.Coordinator, Role.SuperAdmin]), validate(trainingApplicationIdParamSchema.extend(trainingApplicationApproveSchema.shape)), approveTrainingApplicationController)
.get("/", authenticate([Role.Student, Role.Organization, Role.Coordinator, Role.SuperAdmin]), viewTrainingApplicationController)
.get("/:training_id/students/:student_id", authenticate([Role.Organization, Role.Coordinator, Role.Student, Role.SuperAdmin]), validate(trainingApplicationIdParamSchema), getOneTrainingApplicationController)

export default trainingApplicationRouter;