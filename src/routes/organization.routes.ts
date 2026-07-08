import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { organizationIdParamSchema, organizationRegisterSchema, organizationStatusSchema } from "../validations/organization.validation.js";
import { approveOrganizationController, getApprovedOrganizationController, getOneOrganizationController, getPendingOrganizationController, getRejectedOrganizationController, registerOrganizationController, rejectOrganizationController } from "../controllers/organization.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const organizationRouter = Router();

organizationRouter
.post("/register", validate(organizationRegisterSchema), registerOrganizationController)
.post("/approve", authenticate([Role.SuperAdmin]), validate(organizationStatusSchema), approveOrganizationController)
.post("/reject", authenticate([Role.SuperAdmin]), validate(organizationStatusSchema), rejectOrganizationController)
.get("/approved", authenticate(Role.SuperAdmin), getApprovedOrganizationController)
.get("/pending", authenticate(Role.SuperAdmin), getPendingOrganizationController)
.get("/rejected", authenticate(Role.SuperAdmin), getRejectedOrganizationController)
.get("/:organization_id", validate(organizationIdParamSchema), getOneOrganizationController)

export default organizationRouter;