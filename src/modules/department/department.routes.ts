import { Router } from "express";
import { departmentDashboardController, departmentRegisterController, getAllDepartmentController } from "../controllers/department.controller.js";
import Role from "../models/role.model.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { departmentRegisterSchema } from "../modules/department/department.validation.js";

const departmentRoute = Router();

departmentRoute
.post("/register", authenticate(Role.SuperAdmin), validate(departmentRegisterSchema), departmentRegisterController)
.get("/", getAllDepartmentController)
.get("/dashboard", authenticate(Role.Coordinator), departmentDashboardController)

export default departmentRoute;