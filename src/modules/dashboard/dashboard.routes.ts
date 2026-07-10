import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";
import { dashboardController } from "../controllers/dashboard.controller.js";

const dashboardRoute = Router();

dashboardRoute
.get("/", authenticate([Role.Student, Role.Coordinator, Role.SuperAdmin]), dashboardController)

export default dashboardRoute;