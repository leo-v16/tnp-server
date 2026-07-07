import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";
import { trainingCreateSchema } from "../validations/training.validation.js";
import { createTrainingController, getTrainingController } from "../controllers/training.controller.js";

const trainingRouter = Router();

trainingRouter
.post("/create", authenticate([Role.Organization, Role.SuperAdmin, Role.Coordinator]), validate(trainingCreateSchema), createTrainingController)
.get("/", authenticate([Role.Student, Role.Organization, Role.Coordinator, Role.SuperAdmin]), getTrainingController)

export default trainingRouter;