import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { organizationApproveSchema, organizationRegisterSchema } from "../validations/organization.validation.js";
import { approveOrganizationController, getApprovedOrganizationController, getOneOrganizationController, getPendingOrganizationController, getRejectedOrganizationController, registerOrganizationController } from "../controllers/organization.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const organizationRouter = Router();

organizationRouter
.post("/register", validate(organizationRegisterSchema), registerOrganizationController)
.post("/approve", authenticate([Role.SuperAdmin]), validate(organizationApproveSchema), approveOrganizationController)
.get("/approved", authenticate(Role.SuperAdmin), getApprovedOrganizationController)
.get("/pending", authenticate(Role.SuperAdmin), getPendingOrganizationController)
.get("/rejected", authenticate(Role.SuperAdmin), getRejectedOrganizationController)
.get("/:organization_id", getOneOrganizationController)

export default organizationRouter;