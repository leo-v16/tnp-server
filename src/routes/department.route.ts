import { Router } from "express";
import { departmentDashboardController, getAllDepartmentController } from "../controllers/department.controller.js";
import Role from "../models/role.model.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const departmentRoute = Router();

departmentRoute
.get("/", getAllDepartmentController)
.get("/dashboard", authenticate(Role.Coordinator), departmentDashboardController)

export default departmentRoute;