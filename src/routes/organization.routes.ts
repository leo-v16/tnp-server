import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { organizationApproveSchema, organizationRegisterSchema } from "../validations/organization.validation.js";
import { registerOrganizationController } from "../controllers/organization.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";
import { approveOrganizationService } from "../services/organization.service.js";

const organizationRouter = Router();

organizationRouter
.post("/register", validate(organizationRegisterSchema), registerOrganizationController)
.post("/approve", authenticate(Role.SuperAdmin), validate(organizationApproveSchema), approveOrganizationService);

export default organizationRouter;