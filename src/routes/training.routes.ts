import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";
import { trainingCreateSchema, trainingIdParamSchema } from "../validations/training.validation.js";
import { createTrainingController, getOneTrainingController, getTrainingController } from "../controllers/training.controller.js";

const trainingRouter = Router();

trainingRouter
.post("/", authenticate([Role.Organization, Role.SuperAdmin, Role.Coordinator]), validate(trainingCreateSchema), createTrainingController)
.get("/", authenticate([Role.Student, Role.Organization, Role.Coordinator, Role.SuperAdmin]), getTrainingController)
.get("/:training_id", authenticate([Role.Student, Role.Organization, Role.Coordinator, Role.SuperAdmin]), validate(trainingIdParamSchema), getOneTrainingController)

export default trainingRouter;