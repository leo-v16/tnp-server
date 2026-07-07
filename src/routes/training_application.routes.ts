import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { trainingApplicationCreateSchema } from "../validations/training_application.validation.js";
import { createTrainingApplicationController, viewTrainingApplicationController } from "../controllers/training_application.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const trainingApplicationRouter = Router();

trainingApplicationRouter
.post("/create", authenticate(Role.Student), validate(trainingApplicationCreateSchema), createTrainingApplicationController)
.get("/view", authenticate([Role.Student, Role.Organization, Role.Coordinator, Role.SuperAdmin]), viewTrainingApplicationController)

export default trainingApplicationRouter;