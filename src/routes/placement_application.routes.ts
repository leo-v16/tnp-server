import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";
import { placementApplicationCreateSchema, placementApplicationIdParamSchema } from "../validations/placement_application.validation.js";
import { approvePlacementApplicationController, createPlacementApplicationController, viewPlacementApplicationController } from "../controllers/placement_application.controller.js";

const placementApplicationRouter = Router();

placementApplicationRouter
.post("/", authenticate(Role.Student), validate(placementApplicationCreateSchema), createPlacementApplicationController)
.patch("/:placement_id/students/:student_id/status", authenticate([Role.Organization, Role.Coordinator, Role.SuperAdmin]), validate(placementApplicationIdParamSchema), approvePlacementApplicationController)
.get("/", authenticate([Role.Student, Role.Organization, Role.Coordinator, Role.SuperAdmin]), viewPlacementApplicationController)

export default placementApplicationRouter;