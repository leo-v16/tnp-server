import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";
import { adminDashboardController } from "../controllers/admin.controller.js";

const adminRoute = Router();

adminRoute
.get("/dashboard", authenticate(Role.SuperAdmin), adminDashboardController)

export default adminRoute;